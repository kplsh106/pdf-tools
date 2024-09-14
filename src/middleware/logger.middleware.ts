import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction ,Request} from "express";
import * as geoip from 'geoip-lite'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req:Request,res: Response,next:NextFunction) {
         const ipAddress =
      req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    const geo = geoip.lookup(ipAddress as string);

    const country = geo ? geo.country : 'Unknown';

    console.log(`IP Address: ${ipAddress}`);
    console.log(`Country: ${country}`);

        next();
    }
}