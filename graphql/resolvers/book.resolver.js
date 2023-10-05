const { ApolloError } = require('apollo-server-express')
const bookService = require('../../service/book.service')

const GetAllBooks = async () => {

    const [status, data] = await bookService.GetMany()
    if (status !== 200) throw new ApolloError(data.message)
    return data
}

const GetBookById = async (_, { book_id }, context) => {

    if (!context.bookLoader) throw new ApolloError('no book loader')
    if (!book_id) throw new ApolloError('no book id')

    try {
        const data = await context.bookLoader.load(book_id)
        return data
    } catch (error) {
        throw new ApolloError(error)
    }
}

const CreateManyBooks = async (_, { books_data }) => {

    if (!books_data || !books_data.length) throw new ApolloError('no books data')

    const [status, data] = await bookService.CreateMany(books_data)
    if (status !== 200) throw new ApolloError(data.message)
    return data
}

const UpdateBookById = async (_, { book_id, book_data }) => {

    if (!book_id) throw new ApolloError('no book id')
    if(!book_data) throw new ApolloError('no book data')

    const isbookDatahaveProperty = Object.keys(book_data).length !== 0
    if(!isbookDatahaveProperty) throw new ApolloError('wrong book data')

    const [status, data] = await bookService.UpdateOne(book_id, book_data)
    if (status !== 200) throw new ApolloError(data.message)
    return data
}

const DeleteBookById = async (_, { book_id }) => {

    if (!book_id) throw new ApolloError('no book id')

    const [status, data] = await bookService.DeleteOne(book_id)
    if (status !== 200) throw new ApolloError(data.message)
    return data
}

const Author = async (parent, _, context) => {

    if (!context.authorLoader) throw new ApolloError('no author loader')
    if (!parent) return null
    if (!parent.author_id) throw new ApolloError('no author id')

    try {
        const data = await context.authorLoader.load(parent.author_id)
        return data
    } catch (error) {
        throw new ApolloError(error)
    }
}

const Books = async (parent, _, context) => {

    if (!context.bookLoader) throw new ApolloError('no book loader')
    if(!parent) return null
    if (!parent.books_id) throw new ApolloError('no books id')

    try {
        const data = await context.bookLoader.loadMany(parent.books_id)
        return data
    } catch (error) {
        throw new ApolloError(error)
    }
}

module.exports = {
    query: {
        getAllBooks: GetAllBooks,
        getBookById: GetBookById
    },
    mutation: {
        createManyBooks: CreateManyBooks,
        updateBookById: UpdateBookById,
        deleteBookById: DeleteBookById
    },
    main: {
        Book: {
            author_id: Author
        },
        Author: {
            books_id: Books
        }
    }
}