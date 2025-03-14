import mongoose, { Schema, Document, Model } from "mongoose";
import Joi, { ObjectSchema } from "joi";

interface IBook extends Document {
  id: number;
  title: string;
  author: string;
  year: number;
  genre: string;
}

const bookSchema: Schema<IBook> = new Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  year: { type: Number, required: true, min: 1800, max: 2025 },
  genre: { type: String, required: true, minlength: 2 },
});

const Books: Model<IBook> = mongoose.model<IBook>("MyBooks", bookSchema);

const bookDataValidator: ObjectSchema = Joi.object({
  id: Joi.number().min(1).required(),
  title: Joi.string().required(),
  author: Joi.string().required(),
  year: Joi.number().min(1800).max(2025).required(),
  genre: Joi.string().min(2).required(),
});

async function fetchBooks(): Promise<IBook[] | Error> {
  try {
    return await Books.find({});
  } catch (err) {
    return err as Error;
  }
}

const queryPageSchema: ObjectSchema = Joi.object({
  page: Joi.number().integer().min(1).required(),
});

//pagination fetching
async function fetchBooksByPage(page: {page:number}): Promise<{ status: number; data: IBook[] | string }> {
  try {
    const totalBooks = await Books.estimatedDocumentCount();
    console.log(page);
    if (totalBooks < (page.page - 1) * 2) {
      return { status: 404, data: "Sorry, no page found!" };
    } else if (totalBooks === 0) {
      return { status: 404, data: "Sorry, no book is there!" };
    }
    const booksData = await Books.find({}).skip((page.page - 1) * 2).limit(2);
    return { status: 200, data: booksData };
  } catch (err) {
    return { status: 500, data: (err as Error).message };
  }
}

async function addBook(title: string, author: string, year: number, genre: string): Promise<IBook | string | Error> {
  try {
    const lastDocument = await Books.find().sort({ id: -1 }).limit(1);
    const newBookId = lastDocument[0]?.id + 1 || 1;
    
    const { error, value } = bookDataValidator.validate({
      id: newBookId,
      title,
      author,
      year,
      genre,
    });
    
    if (error) return "Incorrect Data!";
    
    const newBook = new Books(value);
    return await newBook.save();
  } catch (err) {
    return err as Error;
  }
}

async function getBook(id: number): Promise<IBook | string | null | any> {
  try {
    const book = await Books.findOne({ id });
    return book || "No Books by this ID";
  } catch (err: any) {
    return err as Error;
  }
}

async function editBook(id: number, bodyValue: Partial<IBook>): Promise<IBook | string | null | any> {
  try {
    const updatedBook = await Books.findOneAndUpdate({ id }, { $set: bodyValue }, { new: true });
    return updatedBook || "No Books found to update";
  } catch (err: any) {
    return err as Error;
  }
}

async function deleteBook(id: number): Promise<IBook | null | Error> {
  try {
    return await Books.findOneAndDelete({ id });
  } catch (err) {
    return err as Error;
  }
}

const booksCurd = { fetchBooks, fetchBooksByPage, addBook, getBook, editBook, deleteBook, queryPageSchema }
export default booksCurd;
