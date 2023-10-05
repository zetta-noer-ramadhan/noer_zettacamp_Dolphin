const { ApolloError } = require('apollo-server-express')
const bookshelfService = require('../../service/bookshelf.service')

const GetAllBookshelves = async () => {

    const [status, data] = await bookshelfService.GetMany()
    if (status !== 200) throw new ApolloError(data.message)
    return data
}

const GetBookshelfById = async (_, { bookshelf_id }, context) => {

    if (!context.bookshelfLoader) throw new ApolloError('no bookshelf loader')
    if (!bookshelf_id) throw new ApolloError('no bookshelf id')

    try {
        const data = await context.bookshelfLoader.load(bookshelf_id)
        return data
    } catch (error) {
        throw new ApolloError(error)
    }
}

const GetAllBookshelvesByBookId = async (_, { book_id }) => {
    // if (!book_id || typeof book_id !== 'string') throw new ApolloError('no book id')

    const [status, data] = await bookshelfService.GetManyByBookId(book_id)
    if (status !== 200) throw new ApolloError(data.message)
    return data
}

const CreateManyBookshelves = async (_, { bookshelves_data }) => {

    if (!bookshelves_data || !bookshelves_data.length) throw new ApolloError('no books data')

    const [status, data] = await bookshelfService.CreateMany(bookshelves_data)
    if (status !== 200) throw new ApolloError(data.message)
    return data
}

const UpdateBookshelfById = async (_, { bookshelf_id, bookshelf_data }) => {

    if (!bookshelf_id) throw new ApolloError('no bookshelf id')
    if (!bookshelf_data) throw new ApolloError('no bookshelf data')

    const isbookshelfDatahaveProperty = Object.keys(bookshelf_data).length !== 0
    if (!isbookshelfDatahaveProperty) throw new ApolloError('wrong bookshelf data')

    const [status, data] = await bookshelfService.UpdateOne(bookshelf_id, bookshelf_data)
    if (status !== 200) throw new ApolloError(data.message)
    return data
}

const DeleteBookshelfById = async (_, { bookshelf_id }) => {

    if (!bookshelf_id) throw new ApolloError('no bookshelf id')

    const [status, data] = await bookshelfService.DeleteOne(bookshelf_id)
    if (status !== 200) throw new ApolloError(data.message)
    return data
}

const InsertManyBooksToBookshelf = async (_, { bookshelf_id, books_ids }) => {

    if (!bookshelf_id) throw new ApolloError('no bookshelf id')
    if (!books_ids || !books_ids.length) throw new ApolloError('no books ids')

    const [status, data] = await bookshelfService.Insert(bookshelf_id, books_ids)
    if (status !== 200) throw new ApolloError(data.message)
    return data.message
}

const InsertBookToBookshelf = async (_, { bookshelf_id, book_id }) => {

    if (!bookshelf_id) throw new ApolloError('no bookshelf id')
    if (!book_id) throw new ApolloError('no book id')

    const [status, data] = await bookshelfService.Insert(bookshelf_id, { bookIds: [book_id] })
    console.log(data)
    if (status !== 200) throw new ApolloError(data.message)
    return data
}

const RemoveManyBooksFromBookshelf = async (_, { bookshelf_id }) => {

    if (!bookshelf_id) throw new ApolloError('no bookshelf id')

    const [status, data] = await bookshelfService.RemoveMany(bookshelf_id)
    if (status !== 200) throw new ApolloError(data.message)
    return data
}

const RemoveBookFromBookshelf = async (_, { bookshelf_id, book_id }) => {

    if (!bookshelf_id) throw new ApolloError('no bookshelf id')
    if (!book_id) throw new ApolloError('no book id')

    const [status, data] = await bookshelfService.RemoveOne(bookshelf_id, book_id)
    if (status !== 200) throw new ApolloError(data.message)
    return data
}

const Books = async (parent, _, context) => {

    if (!context.bookLoader) throw new ApolloError('no book loader')
    if (!parent) return null
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
        getAllBookshelves: GetAllBookshelves,
        getBookshelfById: GetBookshelfById,
        getAllBookshelvesByBookId: GetAllBookshelvesByBookId
    },
    mutation: {
        createManyBookshelves: CreateManyBookshelves,
        updateBookshelfById: UpdateBookshelfById,
        deleteBookshelfById: DeleteBookshelfById,
        insertManyBooksToBookshelf: InsertManyBooksToBookshelf,
        insertBookToBookshelf: InsertBookToBookshelf,
        removeManyBooksFromBookshelf: RemoveManyBooksFromBookshelf,
        removeBookFromBookshelf: RemoveBookFromBookshelf
    },
    main: {
        Bookshelf: {
            books_id: Books
        }
    }
}