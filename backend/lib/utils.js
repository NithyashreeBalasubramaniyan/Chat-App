import jwt from 'jsonwebtoken'
export function gentoken(id){
    const token=jwt.sign({id},process.env.JWT_SECRET)
    return token;
}