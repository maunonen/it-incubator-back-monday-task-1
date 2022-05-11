import express, { Request, Response } from 'express'
const app = express()
const port = 5000

import cors from 'cors'
import bodyParser from "body-parser";

app.use(cors())
// app.use(bodyParser.json())
app.use(express.json())

let videos = [
    {id: 1, title: 'About JS - 01', author: 'it-incubator.eu'},
    {id: 2, title: 'About JS - 02', author: 'it-incubator.eu'},
    {id: 3, title: 'About JS - 03', author: 'it-incubator.eu'},
    {id: 4, title: 'About JS - 04', author: 'it-incubator.eu'},
    {id: 5, title: 'About JS - 05', author: 'it-incubator.eu'},
]

app.get('/', (req: Request, res: Response ) => {
    res.send('Hello: World!')
})

app.get('/videos', (req: Request, res: Response ) => {
    res.send(videos)
})

app.get('/videos/:videoId', (req: Request, res: Response) => {
    const id = +req.params.videoId;
    const itemFound = videos && videos.find(x => x.id === id)
    if (!itemFound){
        res.status(404).send('Nothing found')
        return
    }
    res.send(itemFound)
})

app.post('/videos', (req: Request, res: Response) => {
    const newVideo = {
        id: +(new Date()),
        title: req.body.title,
        author: 'it-incubator.eu'
    }
    videos.push(newVideo)
    res.status(201).send(newVideo)
})

app.delete('/videos/:id',(req: Request, res: Response)=>{
    const id = +req.params.id;
    // const index = videos.findIndex(x => x.id === id)
    // if (index !== -1) {
    //     videos.splice(index, 1)
    //     res.status(204)
    //     return
    // }
    // res.status(404)
    videos = videos.filter(x => x.id !== id)
    res.status(204)
})

app.put('/videos/:id',(req: Request, res: Response)=>{
    const id = +req.params.id;
    const title = req.body.title
    videos = videos.map(x => {
        if (x.id === id){
            return {
                ...x,
                title
            }
        }
        return x
    })
})

app.listen(port, () => {
    console.log(`Example`)
    console.log(`Example app listening on port ${port}`)
})
