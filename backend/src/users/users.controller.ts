import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from 'src/auth/guards/jwtAuth.guards';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Post('find')
  async findMany(@Body() findUser) {
    const user = await this.usersService.findMany(findUser);
    return user;
  }

  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get('me')
  getMe(@Req() req) {
    const { id } = req.user;
    return this.usersService.findOne(id);
  }
  @Get(':username')
  async getUserByName(@Param('username') username: string) {
    return await this.usersService.findByUserName(username);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(+id);
  }
  @Get('me/wishes')
  getWishes(@Req() req) {
    const { username } = req.user;
    return this.usersService.getUserWishes(username);
  }

  @Get(':username/wishes')
  async getUserWishes(@Param('username') username) {
    return this.usersService.getUserWishes(username);
  }

  @Patch('me')
  async update(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(req.user.id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.usersService.remove(+id);
  }
}
