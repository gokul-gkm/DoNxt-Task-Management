import  { Document, Model } from "mongoose";

import { Service } from "typedi";
import { IBaseRepository } from "../interfaces/base.repository.interface";

@Service()
export abstract class BaseRepository< T extends Document, C = T,> implements IBaseRepository<T, C> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async save(document: T): Promise<T> {
    try {
      return await document.save();
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Database Error (save): ${error.message}`);
      }
      throw new Error("Unknown error occurred in save");
    }
  }

async findAll( filter: Record<string, any> = {}, options: any = {}): Promise<T[]> {
  try {
    return await this.model.find(filter, null, options).exec();
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Database Error (findAll): ${error.message}`);
    }
    throw new Error("Unknown error occurred in findAll");
  }
}

  async findById(id: string): Promise<T | null> {
    try {
      const result = await this.model.findById(id).exec();
      if (!result) throw new Error(`No record found with ID: ${id}`);
      return result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Database Error (findById): ${error.message}`);
      }
      throw new Error("Unknown error occurred in findById");
    }
  }

  async create(data: C): Promise<T> {
    try {
      const doc = new this.model(data as any);
      return (await doc.save()) as T;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Database Error (create): ${error.message}`);
      }
      throw new Error("Unknown error occurred in create");
    }
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    try {
      const updatedRecord = await this.model
        .findByIdAndUpdate(id, data, { new: true })
        .exec();
      if (!updatedRecord)
        throw new Error(`Update failed: No record found with ID: ${id}`);
      return updatedRecord;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Database Error (update): ${error.message}`);
      }
      throw new Error("Unknown error occurred in update");
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const deletedRecord = await this.model.findByIdAndDelete(id).exec();
      if (!deletedRecord)
        throw new Error(`Delete failed: No record found with ID: ${id}`);
      return true;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Database Error (delete): ${error.message}`);
      }
      throw new Error("Unknown error occurred in delete");
    }
  }
  
    async findOne(filter: Record<string, any>): Promise<T | null> {
        try {
        return this.model.findOne(filter).exec();
        
      } catch (error) {
        if (error instanceof Error) {
        throw new Error(`Database Error (findOne): ${error.message}`);
      }
      throw new Error("Unknown error occurred in findOne");
      }
    
  }
}
