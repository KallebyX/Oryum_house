import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { CondominiumService } from './condominium.service';
import {
  CreateCondominiumDto,
  UpdateCondominiumDto,
  QueryCondominiumDto,
  UploadLogoDto,
} from './dto/condominium.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('condominiums')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('condominiums')
export class CondominiumController {
  constructor(private readonly condominiumService: CondominiumService) {}

  @Post()
  @Roles(UserRole.ADMIN_GLOBAL)
  @ApiOperation({ summary: 'Create a new condominium (ADMIN only)' })
  @ApiResponse({
    status: 201,
    description: 'Condominium created successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Condominium with this CNPJ already exists',
  })
  create(@Body() createCondominiumDto: CreateCondominiumDto) {
    return this.condominiumService.create(createCondominiumDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all condominiums with filters and pagination' })
  @ApiResponse({
    status: 200,
    description: 'List of condominiums',
  })
  findAll(@Query() query: QueryCondominiumDto) {
    return this.condominiumService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get condominium details by ID' })
  @ApiResponse({
    status: 200,
    description: 'Condominium details',
  })
  @ApiResponse({
    status: 404,
    description: 'Condominium not found',
  })
  findOne(@Param('id') id: string) {
    return this.condominiumService.findOne(id);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get condominium statistics' })
  @ApiResponse({
    status: 200,
    description: 'Condominium statistics including units, residents, tickets, etc.',
  })
  @ApiResponse({
    status: 404,
    description: 'Condominium not found',
  })
  getStats(@Param('id') id: string) {
    return this.condominiumService.getStats(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN_GLOBAL, UserRole.SINDICO)
  @ApiOperation({ summary: 'Update condominium information' })
  @ApiResponse({
    status: 200,
    description: 'Condominium updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Condominium not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Condominium with this CNPJ already exists',
  })
  update(
    @Param('id') id: string,
    @Body() updateCondominiumDto: UpdateCondominiumDto,
  ) {
    return this.condominiumService.update(id, updateCondominiumDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN_GLOBAL)
  @ApiOperation({ summary: 'Delete a condominium (soft delete - ADMIN only)' })
  @ApiResponse({
    status: 200,
    description: 'Condominium deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Condominium not found',
  })
  remove(@Param('id') id: string) {
    return this.condominiumService.remove(id);
  }

  @Post(':id/logo')
  @Roles(UserRole.ADMIN_GLOBAL, UserRole.SINDICO)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload condominium logo' })
  @ApiBody({
    description: 'Logo file (max 2MB, formats: jpg, png)',
    type: UploadLogoDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Logo uploaded successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid file type or file too large',
  })
  @ApiResponse({
    status: 404,
    description: 'Condominium not found',
  })
  async uploadLogo(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }), // 2MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.condominiumService.uploadLogo(id, file);
  }
}
