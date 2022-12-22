import { Router } from "express";
import * as fs from 'fs'
const router: Router = Router();

/**
 * http://localhost/qr GET
 */

router.get('/', (req, res) => {
    const path = `${process.cwd()}/temp`;
    res.writeHead(200, { "content-type": "image/svg+xml" });
    fs.createReadStream(`${path}/qr.svg`).pipe(res);
});

export { router };