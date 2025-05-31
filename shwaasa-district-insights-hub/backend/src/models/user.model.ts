  import mongoose, { Schema, Document } from 'mongoose';

  export interface IUser extends Document {
    username: string;
    password: string;
     isAdmin: boolean;
  }

  const userSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false }, 
  });

  export default mongoose.model<IUser>('User', userSchema);