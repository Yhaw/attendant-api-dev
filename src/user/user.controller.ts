import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  HttpStatus,
  HttpCode,
  UseInterceptors,
  ClassSerializerInterceptor,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthType } from './enum/auth-type.enum';
import { Auth } from './authentication/decorators/auth.decorators';
import { ActiveUserData } from './interfaces/active-user-data.interface';
import { ActiveUser } from './decorators/actve-user.decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesAzureService } from 'src/fileUpload/file.service';

@ApiTags('Users')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly fileService: FilesAzureService,
  ) {}

  @Auth(AuthType.None)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({})
  @ApiCreatedResponse({ description: 'User created successful' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Auth(AuthType.Bearer)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Auth(AuthType.Bearer)
  @Get(':id')
  findOne(@ActiveUser() user: ActiveUserData) {
    return this.userService.getUser(user.sub);
  }

  @Auth(AuthType.Bearer)
  @Patch('')
  update(
    @ActiveUser() user: ActiveUserData,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(user.sub, updateUserDto);
  }

  // @Auth(AuthType.Bearer)
  // @Patch('profile-picture')
  // updateUserProfile(
  //   @ActiveUser() user: ActiveUserData,
  //   @Body() updateUserProfile: UpdateUserProfileDto,
  // ) {
  //   return this.userService.createUserProfilePicture(
  //     user.sub,
  //     updateUserProfile,
  //   );
  // }

  @Auth(AuthType.Bearer)
  @Delete('remove-user-profile')
  removeUserProfile(@ActiveUser() user: ActiveUserData): Promise<UserDto> {
    console.log('Current User', user);
    return this.userService.deleteUserProfilePicture(user.sub);
  }

  @Auth(AuthType.Bearer)
  @Delete('')
  remove(@ActiveUser() user: ActiveUserData): Promise<UserDto> {
    console.log('Current User', user);
    return this.userService.delete(user.sub);
  }

  @Auth(AuthType.Bearer)
  @Patch('upload-profile-picture')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @ActiveUser() user: ActiveUserData,
  ) {
    const containerName = 'attendant';
    const upload = await this.fileService.uploadFile(file, containerName);
    await this.userService.saveUrl(user.sub, upload);
    return { upload, message: 'uploaded successfully' };
  }

  @Auth(AuthType.Bearer)
  @Get('current-user')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Return Current User ',
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  currentUser(@ActiveUser() user: ActiveUserData) {
    console.log('Current User', user);
    return this.userService.getCurrentUser(user.sub);
  }
}
