import {db} from './index'

export function logEvent({event, path, referrer, userAgent, ip}:{
    event: string,
    path: string,
    referrer:string,
    userAgent:string,
    ip?: string | undefined
}){
    return db.execute(
        'INSERT INTO logs (event, path, referrer, user_agent, ip) VALUES (?,?,?,?,?)',
        [event, path, referrer, userAgent, ip]
      );
}

export function getVisitorCount({daysAgo = 30}:{daysAgo?:number|undefined}){
    return db.execute(`
        SELECT 
            COUNT(id) as visits, 
            DATE(created_at) as date 
        FROM logs
        WHERE event = 'page_view' 
            AND path = '/' 
            AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
        GROUP BY DATE(created_at)
        ;
        `, [daysAgo])
}

export function getPagePopularity({daysAgo = 30}:{daysAgo?:number|undefined}){
    return db.execute(`
        SELECT
            COUNT(id) as visits,
            path as page
        FROM logs
        WHERE event = 'page_view'
            AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
        GROUP BY path
    `, [daysAgo])
}