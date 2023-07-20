import { addDoc, collection } from "@firebase/firestore"
import db from "../firebase"

//Handle data store into "Task" collection
const handleSubmit = (task) => {
    const ref = collection(db, "task") // Firebase creates this automatically
 
    let data = {
        task: task
    }
    
    try {
        addDoc(ref, data)
    } catch(err) {
        console.log(err)
    }
}
 
export default handleSubmit