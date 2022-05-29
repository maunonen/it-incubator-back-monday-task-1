import express, {NextFunction, Request, Response} from 'express'
const app = express()
const port = process.env.PORT || 3000

import cors from 'cors'
import bodyParser from "body-parser";

let countRequest = 0
const countMiddleware = (req: Request, res: Response, next: NextFunction) => {
    ++countRequest
    res.header('Request-Count', countRequest.toString())
    console.log('countRequest', countRequest)
    next()
}
const blockedIp = (req: Request, res: Response, next: NextFunction) => {
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    const result = blockedAddress.find((x: string) => x === ip)
    if (result) {
        res.status(403).send()
        return
    }
    next()
}

const checkContentType = (contentType: string) => (req: Request, res: Response, next: NextFunction) => {
    const checkContent = req.headers['content-type']
    if (checkContent === contentType) {
        next()
    } else {
        res.status(400).send()
    }
}

app.use(cors())
app.use(bodyParser.json())
app.use(express.json())
app.use(blockedIp)
app.use(countMiddleware)
// app.use(checkContentType('content-type'))

let videos = [
    {id: 1, title: 'About JS - 01', author: 'it-incubator.eu'},
    {id: 2, title: 'About JS - 02', author: 'it-incubator.eu'},
    {id: 3, title: 'About JS - 03', author: 'it-incubator.eu'},
    {id: 4, title: 'About JS - 04', author: 'it-incubator.eu'},
    {id: 5, title: 'About JS - 05', author: 'it-incubator.eu'},
]

app.get('/', (req: Request, res: Response ) => {
    res.send('Hello: World!')
    return
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

const blockedAddress = [
    '192.168.0.1',
    '192.168.0.2',
    '192.168.0.3',
    '192.168.0.4',
    '192.168.0.5'
]

app.listen(port, () => {
    console.log(`Example`)
    console.log(`Example app listening on port ${port}`)
})
