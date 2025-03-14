import express, { Request, Response, Application } from 'express';
import { connectDB, authenticationMiddleware } from '../mongoDB/bookLib_db';
import booksCurd from '../mongoDB/bookModel';

const app: Application = express();
const port: number = 6933;

app.use(express.json());
app.use(authenticationMiddleware);

// Connect to MongoDB
async function connectMongo(): Promise<void> {
    await connectDB();
}
connectMongo();

//Fetch all books or by page --- two books per page
app.get('/', async (req: Request, res: Response): Promise<any> => {
    try {
        if (req.query?.page) {
            const page = parseInt(req.query.page as string, 10);
            const { error, value } = booksCurd.queryPageSchema.validate({ page });
            
            if (error) {
                return res.status(400).json({ error: error.details.map(detail => detail.message) });
            }
            
            const booksDataResultPerPage = await booksCurd.fetchBooksByPage(value);
            return res.status(booksDataResultPerPage.status).json(booksDataResultPerPage.data);
        }
        
        const booksDataResult = await booksCurd.fetchBooks();
        return res.status(200).json(booksDataResult);
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error });
    }
});

//Add a new book
app.post('/books', async (req: Request, res: Response): Promise<any> => {
    try {
        const { title, author, year, genre } = req.body;
        const savedBook = await booksCurd.addBook(title, author, year, genre);
        return res.status(201).json(savedBook);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to add book', error });
    }
});

//Get a book by ID
app.get('/books/:id', async (req: any, res: Response): Promise<any> => {
    try {
        const findBook = await booksCurd.getBook(req.params.id);
        return res.json(findBook);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch book', error });
    }
});

//Update a book by ID
app.put('/books/:id', async (req: any, res: Response): Promise<any> => {
    try {
        const updatedBook = await booksCurd.editBook(req.params.id, req.body);
        return res.json(updatedBook);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to update book', error });
    }
});

//Delete a book by ID
app.delete('/books/:id', async (req: any, res: Response): Promise<any> => {
    try {
        const deletedBook = await booksCurd.deleteBook(req.params.id);
        
        if (!deletedBook || Object.keys(deletedBook).length === 0) {
            return res.status(404).json({ message: 'No book found for deletion' });
        }
        
        return res.status(200).json(deletedBook);
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong, Internal Server Error!', error });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});