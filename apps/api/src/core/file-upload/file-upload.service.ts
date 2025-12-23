import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as path from 'path';
import * as crypto from 'crypto';
import { createReadStream } from 'fs';
import { promisify } from 'util';
import { exec } from 'child_process';

const execAsync = promisify(exec);

// Lazy load sharp to prevent crashes if native bindings are unavailable
let sharpModule: typeof import('sharp') | null = null;
let sharpLoadError: Error | null = null;

async function getSharp(): Promise<typeof import('sharp')> {
  if (sharpLoadError) {
    throw sharpLoadError;
  }
  if (!sharpModule) {
    try {
      sharpModule = await import('sharp');
    } catch (error) {
      sharpLoadError = error as Error;
      throw error;
    }
  }
  return sharpModule;
}

interface UploadResult {
  success: boolean;
  url?: string;
  key?: string;
  filename?: string;
  size?: number;
  mimeType?: string;
  thumbnailUrl?: string;
  error?: string;
}

interface ScanResult {
  clean: boolean;
  threat?: string;
  error?: string;
}

@Injectable()
export class FileUploadService {
  private readonly logger = new Logger(FileUploadService.name);
  private s3Client: S3Client;
  private bucket: string;

  constructor(private configService: ConfigService) {
    this.initializeS3Client();
    this.bucket = this.configService.get('S3_BUCKET', 'oryumhouse-files');
  }

  private initializeS3Client() {
    const endpoint = this.configService.get('S3_ENDPOINT');
    const accessKeyId = this.configService.get('S3_ACCESS_KEY');
    const secretAccessKey = this.configService.get('S3_SECRET_KEY');
    const region = this.configService.get('S3_REGION', 'us-east-1');

    if (!endpoint || !accessKeyId || !secretAccessKey) {
      this.logger.warn('Configurações S3 incompletas. Upload de arquivos não funcionará.');
      return;
    }

    this.s3Client = new S3Client({
      endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      region,
      forcePathStyle: true, // Necessário para MinIO
    });

    this.logger.log('Cliente S3 inicializado com sucesso');
  }

  async uploadFile(
    file: Express.Multer.File, 
    folder: string = 'uploads',
    options: {
      generateThumbnail?: boolean;
      maxSize?: number;
      allowedMimeTypes?: string[];
      scanVirus?: boolean;
    } = {}
  ): Promise<UploadResult> {
    try {
      // Validações
      const validationResult = this.validateFile(file, options);
      if (!validationResult.valid) {
        throw new BadRequestException(validationResult.error);
      }

      // Scan de antivírus se habilitado
      if (options.scanVirus !== false) {
        const scanResult = await this.scanFile(file);
        if (!scanResult.clean) {
          throw new BadRequestException(`Arquivo infectado: ${scanResult.threat}`);
        }
      }

      // Gerar nome único para o arquivo
      const fileExtension = path.extname(file.originalname);
      const fileName = `${crypto.randomUUID()}${fileExtension}`;
      const key = `${folder}/${fileName}`;

      // Upload do arquivo principal
      const uploadCommand = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        Metadata: {
          originalName: file.originalname,
          uploadedAt: new Date().toISOString(),
        },
      });

      await this.s3Client.send(uploadCommand);

      const url = await this.getSignedUrl(key);
      let thumbnailUrl: string | undefined;

      // Gerar thumbnail se for imagem (gracefully handle if sharp is unavailable)
      if (options.generateThumbnail && this.isImage(file.mimetype)) {
        try {
          thumbnailUrl = await this.generateThumbnail(file, folder, fileName);
        } catch (thumbnailError) {
          this.logger.warn(`Thumbnail generation failed (sharp may not be available): ${thumbnailError.message}`);
          // Continue without thumbnail - don't fail the entire upload
        }
      }

      this.logger.log(`Arquivo enviado com sucesso: ${fileName}`);

      return {
        success: true,
        url,
        key,
        filename: fileName,
        size: file.size,
        mimeType: file.mimetype,
        thumbnailUrl,
      };

    } catch (error) {
      this.logger.error(`Erro no upload: ${error.message}`);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async deleteFile(key: string): Promise<{ success: boolean; error?: string }> {
    try {
      const deleteCommand = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      await this.s3Client.send(deleteCommand);

      // Tentar deletar thumbnail se existir
      const thumbnailKey = key.replace('/uploads/', '/thumbnails/');
      try {
        const deleteThumbnailCommand = new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: thumbnailKey,
        });
        await this.s3Client.send(deleteThumbnailCommand);
      } catch {
        // Ignorar erro se thumbnail não existir
      }

      this.logger.log(`Arquivo deletado: ${key}`);
      return { success: true };

    } catch (error) {
      this.logger.error(`Erro ao deletar arquivo: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  async scanFile(file: Express.Multer.File): Promise<ScanResult> {
    try {
      const clamavHost = this.configService.get('CLAMAV_HOST', 'localhost');
      const clamavPort = this.configService.get('CLAMAV_PORT', '3310');

      // Verificar se ClamAV está disponível
      try {
        await execAsync(`nc -z ${clamavHost} ${clamavPort}`);
      } catch {
        this.logger.warn('ClamAV não disponível, pulando scan de vírus');
        return { clean: true };
      }

      // Salvar arquivo temporariamente
      const tempPath = `/tmp/${crypto.randomUUID()}_${file.originalname}`;
      const fs = require('fs');
      fs.writeFileSync(tempPath, file.buffer);

      try {
        // Executar scan
        const { stdout } = await execAsync(`clamdscan --no-summary ${tempPath}`);
        
        // Limpar arquivo temporário
        fs.unlinkSync(tempPath);

        if (stdout.includes('FOUND')) {
          const threat = stdout.split(':')[1]?.trim() || 'Unknown threat';
          this.logger.warn(`Vírus detectado: ${threat} no arquivo ${file.originalname}`);
          return { clean: false, threat };
        }

        return { clean: true };

      } catch (error) {
        // Limpar arquivo temporário em caso de erro
        if (fs.existsSync(tempPath)) {
          fs.unlinkSync(tempPath);
        }
        throw error;
      }

    } catch (error) {
      this.logger.error(`Erro no scan de vírus: ${error.message}`);
      return { clean: false, error: error.message };
    }
  }

  private async generateThumbnail(
    file: Express.Multer.File,
    folder: string,
    originalFileName: string
  ): Promise<string> {
    try {
      const sharp = await getSharp();
      const thumbnailBuffer = await sharp.default(file.buffer)
        .resize(300, 300, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({ quality: 80 })
        .toBuffer();

      const thumbnailKey = `${folder}/thumbnails/thumb_${originalFileName.replace(path.extname(originalFileName), '.jpg')}`;

      const uploadCommand = new PutObjectCommand({
        Bucket: this.bucket,
        Key: thumbnailKey,
        Body: thumbnailBuffer,
        ContentType: 'image/jpeg',
      });

      await this.s3Client.send(uploadCommand);

      return await this.getSignedUrl(thumbnailKey);

    } catch (error) {
      this.logger.error(`Erro ao gerar thumbnail: ${error.message}`);
      throw error;
    }
  }

  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return await getSignedUrl(this.s3Client, command, { expiresIn });
  }

  private validateFile(
    file: Express.Multer.File,
    options: {
      maxSize?: number;
      allowedMimeTypes?: string[];
    }
  ): { valid: boolean; error?: string } {
    // Verificar tamanho
    const maxSize = options.maxSize || parseInt(this.configService.get('MAX_FILE_SIZE', '10485760')); // 10MB
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `Arquivo muito grande. Tamanho máximo: ${this.formatFileSize(maxSize)}`,
      };
    }

    // Verificar tipo MIME
    const allowedTypes = options.allowedMimeTypes || 
      this.configService.get('ALLOWED_FILE_TYPES', 'image/jpeg,image/png,image/gif,application/pdf,video/mp4').split(',');
    
    if (!allowedTypes.includes(file.mimetype)) {
      return {
        valid: false,
        error: `Tipo de arquivo não permitido. Tipos aceitos: ${allowedTypes.join(', ')}`,
      };
    }

    return { valid: true };
  }

  private isImage(mimeType: string): boolean {
    return mimeType.startsWith('image/');
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Métodos específicos para diferentes tipos de upload
  async uploadTicketAttachment(file: Express.Multer.File, ticketId: string): Promise<UploadResult> {
    return this.uploadFile(file, `tickets/${ticketId}`, {
      generateThumbnail: true,
      scanVirus: true,
    });
  }

  async uploadUserAvatar(file: Express.Multer.File, userId: string): Promise<UploadResult> {
    return this.uploadFile(file, `avatars`, {
      generateThumbnail: true,
      maxSize: 2 * 1024 * 1024, // 2MB
      allowedMimeTypes: ['image/jpeg', 'image/png'],
      scanVirus: true,
    });
  }

  async uploadDocument(file: Express.Multer.File, condominiumId: string): Promise<UploadResult> {
    return this.uploadFile(file, `documents/${condominiumId}`, {
      generateThumbnail: false,
      scanVirus: true,
    });
  }

  async uploadCondominiumLogo(file: Express.Multer.File, condominiumId: string): Promise<UploadResult> {
    return this.uploadFile(file, `logos`, {
      generateThumbnail: true,
      maxSize: 1 * 1024 * 1024, // 1MB
      allowedMimeTypes: ['image/jpeg', 'image/png'],
      scanVirus: true,
    });
  }

  // Método para gerar URL pré-assinada para upload direto do frontend
  async generatePresignedUploadUrl(
    folder: string,
    filename: string,
    contentType: string,
    expiresIn: number = 300
  ): Promise<{ uploadUrl: string; key: string }> {
    const key = `${folder}/${crypto.randomUUID()}_${filename}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(this.s3Client, command, { expiresIn });

    return { uploadUrl, key };
  }

  // Método para listar arquivos
  async listFiles(prefix: string = '', maxKeys: number = 100) {
    try {
      // Método simplificado - retorna lista vazia por enquanto
      // Em produção, implementar com ListObjectsV2Command
      this.logger.log(`Listando arquivos do prefixo: ${prefix}`);
      
      return {
        success: true,
        files: [],
        message: 'Listagem de arquivos não implementada em desenvolvimento'
      };

    } catch (error) {
      this.logger.error(`Erro ao listar arquivos: ${error.message}`);
      return { success: false, error: error.message };
    }
  }
}
