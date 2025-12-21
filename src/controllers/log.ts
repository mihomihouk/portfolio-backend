import { isBotUser } from '../utils/bot-detection'
import { logEvent } from '../respositories/log.repository'
import { Request, Response } from 'express'

export async function logUserActivity(req: Request, res: Response){
    try {
        const { event, path, referrer, userAgent } = req.body
    
        if (!event || !path) {
        return res.status(400).json({ error: 'Event and path are required' })
        }
    
        if (userAgent && req.ip) {
        const isBot = await isBotUser(userAgent, req.ip)
        if (isBot) {
            return res.status(403).json({ error: 'Bot user detected' })
        }
        }
        await logEvent({ event, path, referrer, userAgent, ip: req.ip })
    
        return res.status(200).json({ ok: true })
    } catch (err) {
        console.error('Error logging event:', err)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

