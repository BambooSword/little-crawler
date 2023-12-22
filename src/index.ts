import express from 'express'
import crawler from './jikexiu'
const app = express()
const port = 3000

app.get('/crawl', async (req, res, next) => {
  // const website = req.query.website
  // if (!website) {
  //   interface IErrorWithStatus extends Error {
  //     status?: number
  //   }
  //   const err: IErrorWithStatus = new Error('required query website')
  //   err.status = 400
  //   next(err)
  // }
  try {
    crawler()
  } catch (e) {
    console.log(e)
    res.status(500).send('Something broken')
  }
})

app.listen(port, () => {
  console.log('====================================')
  console.log('app is running on port: ', port)
  console.log('====================================')
})
