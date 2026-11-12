export interface JwtPayload {
  sub: number; // 用户ID，标准 JWT 字段。
  username: string; // 用户名
}
