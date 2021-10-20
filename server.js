const { createServer } = require('http')
const { join } = require('path')
const { parse } = require('url')
const next = require('next')
const app = next({ dev: !!process.env.dev })
const handle = app.getRequestHandler()

console.log(1)
app.prepare()
    .then(() => {
        console.log(2)
        createServer((req, res) => {
            console.log(3)
            const parsedUrl = parse(req.url, true)
            const { pathname } = parsedUrl
            console.log(4)

            if (pathname === '/service-worker.js') {
                const filePath = join(__dirname, '.next', pathname)

                app.serveStatic(req, res, filePath)
            } else {
                handle(req, res, parsedUrl)
            }
        })
            .listen(process.env.URL==='os-kantsut.xyz'?5000:80)
    })