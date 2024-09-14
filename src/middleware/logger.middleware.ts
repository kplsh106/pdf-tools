import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request } from "express";
import * as geoip from 'geoip-lite'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const ipAddress =
            req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const geo = geoip.lookup(ipAddress);
        if (geo) {
            const country = geo.country || 'Unknown';
            const region = geo.region || 'Unknown';
            const city = geo.city || 'Unknown';
            const lat = geo.ll ? geo.ll[0] : 'Unknown';
            const lon = geo.ll ? geo.ll[1] : 'Unknown';
            const timezone = geo.timezone || 'Unknown';

            console.log(`IP Address: ${ipAddress}`);
            console.log(`Country: ${country}`);
            console.log(`Region: ${region}`);
            console.log(`City: ${city}`);
            console.log(`Latitude: ${lat}`);
            console.log(`Longitude: ${lon}`);
            console.log(`Timezone: ${timezone}`);
        } else {
            console.log(`Unable to locate details for IP: ${ipAddress}`);
        }


        next();
    }
}