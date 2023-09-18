use zettacamp

const singleData = {
    first_name: "Sample",
    last_name: "Human",
    address: {
        street_name: "Jalan Raya Dieng",
        district: "Batur",
        regency: "Banjarnegara",
        province: "Central Java",
    },
    hobbies: [
        {
            "name": "listening to music"
        },
        {
            "name": "reading books"
        }
    ]
}

const multipleData = [
    {
        "first_name": "Noer",
        "last_name": "Ramadhan",
        "address": {
            "district": "Batur",
            "regency": "Banjarnegara",
            "province": "Central Java",
            "street_name": "Jalan Raya Dieng"
        },
        "hobbies": [
            {
                "name": "listening to music"
            },
            {
                "name": "reading books"
            }
        ]
    },
    {
        "first_name": "Muhammad",
        "last_name": "Noer",
        "address": {
            "district": "Batur",
            "regency": "Banjarnegara",
            "province": "Central Java",
            "street_name": "Jalan Raya Dieng"
        },
        "hobbies": [
            {
                "name": "listening to music"
            },
            {
                "name": "reading books"
            }
        ]
    },
    {
        "first_name": "Muhammad",
        "last_name": "N",
        "address": {
            "district": "Batur",
            "regency": "Banjarnegara",
            "province": "Central Java",
            "street_name": "Jalan Raya Dieng"
        },
        "hobbies": [
            {
                "name": "listening to music"
            },
            {
                "name": "reading books"
            }
        ]
    },
    {
        "first_name": "Muhammad",
        "last_name": "R",
        "address": {
            "district": "Batur",
            "regency": "Banjarnegara",
            "province": "Central Java",
            "street_name": "Jalan Raya Dieng"
        },
        "hobbies": [
            {
                "name": "listening to music"
            },
            {
                "name": "reading books"
            }
        ]
    },
    {
        "first_name": "Noer",
        "last_name": "R",
        "address": {
            "district": "Batur",
            "regency": "Banjarnegara",
            "province": "Central Java",
            "street_name": "Jalan Raya Dieng"
        },
        "hobbies": [
            {
                "name": "listening to music"
            },
            {
                "name": "reading books"
            }
        ]
    }
]

const model = db.profiles

// model.insertOne(singleData)
// model.insertMany(multipleData)

model.find()

// model.findOne({ last_name: 'R' })
// model.find({ first_name: 'Muhammad' })

// model.find({ status: 'changed' })
// model.find({ status_many: 'changed' })

// model.updateOne({ last_name: 'R' }, { $set: { status: 'changed' } })

// model.updateOne({ status: 'changed' }, { $set: { hobbies: [{ name: 'stargazing' }] } })
// model.updateOne({ status: 'changed ' }, { $push: { hobbies: [{ name: 'daydreaming' }] } })

// model.updateOne({ first_name: "Muhammad" }, { $set: {first_name: "Test"} })

// model.updateMany({}, { $set: { "hobbies.0.name": 'Hobby?' } })

// model.updateMany({ "hobbies.name": "reading books" }, { $set: { "hobbies.$.name": 'sample' } })

// model.updateMany({ first_name: 'Muhammad' }, { $set: { status_many: 'changed' } })
// model.updateMany({ status_many: 'changed' }, { $set: { "address.district": 'Bruh' } })

// model.deleteOne({ last_name: 'R' })
// model.deleteMany({ first_name: 'Muhammad' })

// model.deleteMany({})

