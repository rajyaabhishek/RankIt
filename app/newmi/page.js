import { connectToDatabase } from '@/lib/database/model/rankings';


const functionq = () => {
connectToDatabase();
console.log(process.env.MONGODB_URI)

return "hello world";

}

export default functionq;