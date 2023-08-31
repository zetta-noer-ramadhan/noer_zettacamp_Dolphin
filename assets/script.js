const state = {
    inventory: [],
    is_edit: false
}
const storage = {
    create: (key, data) => localStorage.setItem(key, JSON.stringify(data)),
    read: (key) => JSON.parse(localStorage.getItem(key)),
    update: (key, data) => localStorage.setItem(key, JSON.stringify(data)),
    delete: (key) => localStorage.removeItem(key),
    clear: () => localStorage.clear()
}


const Book = function (title, author, description, count) {
    this.id = state.inventory.length + 1
    this.title = title
    this.author = author
    this.description = description
    this.count = count
}
const BookModel = {
    addBook: (title, author, description, count) => {
        state.inventory.push(new Book(title, author, description, count))
        storage.update('inventory', state.inventory)
    },
    readBooks: () => {
        state.inventory = storage.read('inventory') || []
    },
    readBook: (id) => state.inventory.filter(book => book.id === id),
    updateBook: (id, title, author, description, count) => {
        state.inventory = state.inventory.map(book => {
            if (book.id === id) {
                book.title = title
                book.author = author
                book.description = description
                book.count = count
            }
            return book
        })
        storage.update('inventory', state.inventory)
    },
    deleteBook: (id) => {
        state.inventory = state.inventory.filter(book => book.id !== id)
        storage.update('inventory', state.inventory)
    },
    deleteBooks: () => {
        storage.clear()
    }
}


const handleEdit = (id) => {
    const bookRow = document.getElementById('book-' + id)
    const input = bookRow.querySelectorAll('input')

    storage.update('is_edit', true)

    Array.from(input).forEach(item => {
        item.disabled = !storage.read('is_edit')
    })
    const textarea = bookRow.querySelector('textarea')
    textarea.disabled = !storage.read('is_edit')

    bookRow.querySelector('.action--edit').className = "action--edit hide"
    bookRow.querySelector('.action--save').className = "action--save"
    bookRow.querySelector('.action--cancel').className = "action--cancel"
    bookRow.querySelector('.action--delete').className = "action--delete hide"

}
const handleSave = (id) => {
    const bookRow = document.getElementById('book-' + id)
    const input = bookRow.querySelectorAll('input')
    const textarea = bookRow.querySelector('textarea')

    const [title, author, count] = Array.from(input).map(({ value }) => value)
    const desc = textarea.value

    if (!title) alert('please input book title')
    if (!author) alert('please input book author')
    if (!desc) alert('please input book description')
    if (!count) alert('please input book count')
    if (title && author && count && desc) {
        storage.update('is_edit', false)

        Array.from(input).forEach(item => {
            item.disabled = !storage.read('is_edit')
        })
        textarea.disabled = !storage.read('is_edit')

        bookRow.querySelector('.action--edit').className = "action--edit"
        bookRow.querySelector('.action--save').className = "action--save hide"
        bookRow.querySelector('.action--cancel').className = "action--cancel hide"
        bookRow.querySelector('.action--delete').className = "action--delete"
        BookModel.updateBook(id, title, author, desc, count)
    }
}
const handleCancel = (id) => {
    const bookRow = document.getElementById('book-' + id)
    const input = bookRow.querySelectorAll('input')

    storage.update('is_edit', false)

    Array.from(input).forEach(item => {
        item.disabled = !storage.read('is_edit')
    })
    const textarea = bookRow.querySelector('textarea')
    textarea.disabled = !storage.read('is_edit')

    bookRow.querySelector('.action--edit').className = "action--edit"
    bookRow.querySelector('.action--save').className = "action--save hide"
    bookRow.querySelector('.action--cancel').className = "action--cancel hide"
    bookRow.querySelector('.action--delete').className = "action--delete"

    RefreshRow(id)
}
const handleDelete = (id) => {
    const bookRow = document.getElementById('book-' + id)
    const input = bookRow.querySelectorAll('input')

    const [title] = Array.from(input).filter(item => item.name == 'book-' + id + '-title').map(({ value }) => value)

    const deleteConfirmation = confirm(`Are you sure to delete ${title}?`)
    if (deleteConfirmation) {
        BookModel.deleteBook(id)
        RefreshTable()
    }
}
const handleAdd = () => {
    const element = document.querySelector('#book-add')
    element.style.display = 'table-row'
}
const handleAddSave = () => {
    const element = document.querySelector('#book-add')
    const input = element.querySelectorAll('input')
    const [title, author, count] = Array.from(input).map(({ value }) => value)
    const textarea = element.querySelector('textarea')
    const desc = textarea.value

    if (!title) alert('please input book title')
    if (!author) alert('please input book author')
    if (!desc) alert('please input book description')
    if (!count) alert('please input book count')
    if (title && author && count && desc) {
        BookModel.addBook(title, author, desc, count)
        handleAddCancel()
        RefreshTable()
    }
}
const handleAddCancel = () => {
    const element = document.querySelector('#book-add')
    element.style.display = 'none'

    const input = element.querySelectorAll('input')
    Array.from(input).forEach(item => {
        item.value = ""
    })

    const textarea = element.querySelector('textarea')
    textarea.value = ""
}
const handleClear = () => {
    const clearConfirmation = confirm(`Are you sure to clear the inventory?`)
    if (clearConfirmation) {
        storage.clear()
        BookModel.readBooks()
        RefreshTable()
    }

}


const RefreshRow = (id) => {

    const bookRow = document.getElementById('book-' + id)
    const input = bookRow.querySelectorAll('input')

    const currentBook = BookModel.readBook(id)[0]
    // console.log(currentBook)

    Array.from(input).forEach(item => {
        console.log(id, item.name, item.value)
        if (item.name == 'book-' + id + '-title') item.value = currentBook.title
        if (item.name == 'book-' + id + '-author') item.value = currentBook.title
        if (item.name == 'book-' + id + '-number') item.value = currentBook.count
    })

    const textarea = bookRow.querySelector('textarea')
    textarea.value = currentBook.description
}
const RefreshTable = () => {
    const table = document.getElementById('book__table__body')
    Array.from(table.children).map((item) => {
        item.remove()
    })

    console.log('refreshing')
    if (state.inventory && state.inventory.length > 0) {

        Array.from(state.inventory).forEach(({ id, title, author, description, count }) => {
            table.appendChild(PrepareTableItem(id, title, author, description, count))
        })
    }else{
        console.log('hello')
        const row = document.createElement("tr")
        row.innerHTML = `<td colspan="6" style="padding: 1.5rem 0rem;">No Books :(</td>`
        table.appendChild(row)
    }

}


const PrepareTableItem = (id, title, author, description, count) => {
    const row = document.createElement("tr")
    row.id = 'book-' + id

    row.innerHTML = `<form action="#" name="book-${id}-form" id="book-${id}-form">
        <td>${id}</td>
        <td>
            <input type="text" name="book-${id}-title" value="${title}" disabled>
        </td>
        <td>
            <input type="text" name="book-${id}-author" value="${author}" disabled>
        </td>
        <td>
            <textarea cols="30" rows="1" name="book-${id}-desc" disabled>${description}</textarea>
        </td>
        <td>
            <input type="number" name="book-${id}-number" value="${count}" disabled>
        </td>
        <td>
            <span class='action--edit' onclick="handleEdit(${id})">Edit</span>
            <span class='action--save hide' onclick="handleSave(${id})">Save</span>
            <span class='action--cancel hide' onclick="handleCancel(${id})">Cancel</span>
            <span class='action--delete' onclick="handleDelete(${id})">Delete</span>
        </td>
    </form>`

    return row
}


const main = () => {

    if (storage.read('inventory')) {
        BookModel.readBooks()
    } else {
        storage.create('inventory', [])
    }

    RefreshTable()
}

main()