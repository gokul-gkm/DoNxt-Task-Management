import  { Document, Model } from "mongoose";

import { Service } from "typedi";
import { IBaseRepository } from "../interfaces/base.repository.interface";
import { REPOSITORY_MESSAGES } from "@/constants/messages/repository.messages";

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
        throw new Error(`${REPOSITORY_MESSAGES.SAVE_ERROR} ${error.message}`);
      }
      throw new Error(REPOSITORY_MESSAGES.UNKNOWN_SAVE_ERROR);
    }
  }

async findAll( filter: Record<string, any> = {}, options: any = {}): Promise<T[]> {
  try {
    return await this.model.find(filter, null, options).exec();
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`${REPOSITORY_MESSAGES.FIND_ALL_ERROR}: ${error.message}`);
    }
    throw new Error(REPOSITORY_MESSAGES.UNKNOWN_FIND_ALL_ERROR);
  }
}

  async findById(id: string): Promise<T | null> {
    try {
      const result = await this.model.findById(id).exec();
      if (!result) throw new Error(`${REPOSITORY_MESSAGES.RECORD_NOT_FOUND}: ${id}`);
      return result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${REPOSITORY_MESSAGES.FIND_BY_ID_ERROR}: ${error.message}`);
      }
      throw new Error(REPOSITORY_MESSAGES.UNKNOWN_FIND_BY_ID_ERROR);
    }
  }

  async create(data: C): Promise<T> {
    try {
      const doc = new this.model(data as any);
      return (await doc.save()) as T;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${REPOSITORY_MESSAGES.CREATE_ERROR}: ${error.message}`);
      }
      throw new Error(REPOSITORY_MESSAGES.UNKNOWN_CREATE_ERROR);
    }
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    try {
      const updatedRecord = await this.model
        .findByIdAndUpdate(id, data, { new: true })
        .exec();
      if (!updatedRecord)
        throw new Error(`${REPOSITORY_MESSAGES.RECORD_NOT_FOUND}: ${id}`);
      return updatedRecord;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${REPOSITORY_MESSAGES.UPDATE_ERROR}: ${error.message}`);
      }
      throw new Error(REPOSITORY_MESSAGES.UNKNOWN_UPDATE_ERROR);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const deletedRecord = await this.model.findByIdAndDelete(id).exec();
      if (!deletedRecord)
        throw new Error(`${REPOSITORY_MESSAGES.RECORD_NOT_FOUND}: ${id}`);
      return true;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${REPOSITORY_MESSAGES.DELETE_ERROR}): ${error.message}`);
      }
      throw new Error(REPOSITORY_MESSAGES.UNKNOWN_DELETE_ERROR);
    }
  }
  
    async findOne(filter: Record<string, any>): Promise<T | null> {
        try {
        return this.model.findOne(filter).exec();
        
      } catch (error) {
        if (error instanceof Error) {
        throw new Error(`${REPOSITORY_MESSAGES.FIND_ONE_ERROR}: ${error.message}`);
      }
      throw new Error(REPOSITORY_MESSAGES.UNKNOWN_FIND_ONE_ERROR);
      }
    
  }
}
