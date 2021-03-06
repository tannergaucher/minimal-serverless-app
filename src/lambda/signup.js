const { User } = require('../models')
const connectToDb = require('../connect-to-db')
const { hashSync, genSaltSync } = require('bcryptjs')
const { sign } = require('jsonwebtoken')

export async function handler(event, context) {
  context.callbackWaitsForEmptyEventLoop = false

  try {
    connectToDb()
    const req = JSON.parse(event.body)
    const lowercaseEmail = req.email.toLowerCase()
    const salt = genSaltSync(10)
    const hashedPassword = hashSync(req.password, salt)

    const [existingUser] = await User.find({
      email: req.email.toLowerCase(),
    })

    if (existingUser) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          error: {
            message: `That email address already exists.`,
          },
        }),
      }
    }

    const user = await User.create({
      email: lowercaseEmail,
      password: hashedPassword,
    })

    const token = sign({ userId: user.id }, process.env.REACT_APP_APP_SECRET)

    return {
      statusCode: 200,
      body: JSON.stringify({
        data: {
          user,
          token,
        },
      }),
    }
  } catch (error) {
    console.log(error)

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: {
          message: `Opps. Something went wrong.`,
        },
      }),
    }
  }
}
