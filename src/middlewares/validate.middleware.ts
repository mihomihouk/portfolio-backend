
import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'

export function validateBody(schema: z.ZodObject<any>){
    return (req:Request, res:Response, next: NextFunction)=>{
        const result = schema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({succuss: false, error: z.prettifyError(result.error)}); 
        } else {
            result.data;
            next()
        }
    }
}