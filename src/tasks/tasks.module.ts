// tasks.module.ts
import { Module } from '@nestjs/common';
import { ProductsModule } from '../modules/products/products.module'; // Import the module containing ProductsService
import { TasksService } from './tasks.service';
@Module({
  imports: [ProductsModule], // Import ProductsModule here if ProductsService is provided there
  providers: [TasksService],
})
export class TasksModule {}
