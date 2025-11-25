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
  Req,
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
import { UserService } from './user.service';
import {
  CreateUserDto,
  UpdateUserDto,
  ChangePasswordDto,
  QueryUserDto,
  AddToCondominiumDto,
  UpdateAvatarDto,
} from './dto/user.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(UserRole.ADMIN_GLOBAL, UserRole.SINDICO)
  @ApiOperation({ summary: 'Create a new user (ADMIN/SINDICO only)' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'User with this email already exists',
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @Roles(UserRole.ADMIN_GLOBAL, UserRole.SINDICO)
  @ApiOperation({ summary: 'Get all users with filters and pagination (ADMIN/SINDICO only)' })
  @ApiResponse({
    status: 200,
    description: 'List of users',
  })
  findAll(@Query() query: QueryUserDto) {
    return this.userService.findAll(query);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'Current user profile',
  })
  getMe(@CurrentUser() user: any) {
    return this.userService.findOne(user.sub);
  }

  @Get('me/stats')
  @ApiOperation({ summary: 'Get current user statistics' })
  @ApiResponse({
    status: 200,
    description: 'User statistics',
  })
  getMyStats(@CurrentUser() user: any) {
    return this.userService.getStats(user.sub);
  }

  @Get('me/memberships')
  @ApiOperation({ summary: 'Get current user memberships' })
  @ApiResponse({
    status: 200,
    description: 'User memberships in condominiums',
  })
  getMyMemberships(@CurrentUser() user: any) {
    return this.userService.getMemberships(user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user details by ID' })
  @ApiResponse({
    status: 200,
    description: 'User details',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get user statistics' })
  @ApiResponse({
    status: 200,
    description: 'User statistics',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  getStats(@Param('id') id: string) {
    return this.userService.getStats(id);
  }

  @Get(':id/memberships')
  @ApiOperation({ summary: 'Get user memberships' })
  @ApiResponse({
    status: 200,
    description: 'User memberships in condominiums',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  getMemberships(@Param('id') id: string) {
    return this.userService.getMemberships(id);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
  })
  updateMe(@CurrentUser() user: any, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(user.sub, updateUserDto);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN_GLOBAL, UserRole.SINDICO)
  @ApiOperation({ summary: 'Update user information (ADMIN/SINDICO only)' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Patch('me/password')
  @ApiOperation({ summary: 'Change current user password' })
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Current password is incorrect',
  })
  changeMyPassword(
    @CurrentUser() user: any,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.userService.changePassword(user.sub, changePasswordDto);
  }

  @Patch(':id/password')
  @Roles(UserRole.ADMIN_GLOBAL)
  @ApiOperation({ summary: 'Change user password (ADMIN only)' })
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  changePassword(
    @Param('id') id: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.userService.changePassword(id, changePasswordDto);
  }

  @Post('me/avatar')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload current user avatar' })
  @ApiBody({
    description: 'Avatar file (max 2MB, formats: jpg, png)',
    type: UpdateAvatarDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Avatar uploaded successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid file type or file too large',
  })
  async uploadMyAvatar(
    @CurrentUser() user: any,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.userService.updateAvatar(user.sub, file);
  }

  @Post(':id/avatar')
  @Roles(UserRole.ADMIN_GLOBAL, UserRole.SINDICO)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload user avatar (ADMIN/SINDICO only)' })
  @ApiBody({
    description: 'Avatar file (max 2MB, formats: jpg, png)',
    type: UpdateAvatarDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Avatar uploaded successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid file type or file too large',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async uploadAvatar(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.userService.updateAvatar(id, file);
  }

  @Post(':id/memberships')
  @Roles(UserRole.ADMIN_GLOBAL, UserRole.SINDICO)
  @ApiOperation({ summary: 'Add user to condominium (ADMIN/SINDICO only)' })
  @ApiResponse({
    status: 201,
    description: 'User added to condominium successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User or condominium not found',
  })
  @ApiResponse({
    status: 409,
    description: 'User is already a member of this condominium',
  })
  addToCondominium(
    @Param('id') id: string,
    @Body() addToCondominiumDto: AddToCondominiumDto,
  ) {
    return this.userService.addToCondominium(id, addToCondominiumDto);
  }

  @Delete(':id/memberships/:membershipId')
  @Roles(UserRole.ADMIN_GLOBAL, UserRole.SINDICO)
  @ApiOperation({ summary: 'Remove user from condominium (ADMIN/SINDICO only)' })
  @ApiResponse({
    status: 200,
    description: 'User removed from condominium successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Membership not found',
  })
  removeFromCondominium(
    @Param('id') id: string,
    @Param('membershipId') membershipId: string,
  ) {
    return this.userService.removeFromCondominium(id, membershipId);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN_GLOBAL)
  @ApiOperation({ summary: 'Delete a user (soft delete - ADMIN only)' })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
