export class Log {
  constructor(
    public event: string,
    public path: string,
    public referrer: string,
    public userAgent: string,
    public ip?: string,
    public createdAt?: string
  ) {}

  static fromRow(row: any): Log {
    return new Log(
      row.event,
      row.path,
      row.referrer,
      row.user_agent,
      row.ip,
      row.created_at
    )
  }
}
