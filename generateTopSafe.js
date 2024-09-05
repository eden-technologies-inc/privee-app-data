import { admin } from '@/lib/firebaseAdmin'
import fs from 'fs'
import path from 'path'

// Predefined array of usernames
const predefinedUsernames = ["Jennifer Sarcastic Sister", "goldie-e6xhqp4s", "jennifer-tuck-xy0xpvd0", "Lucy Davies","cleopatra-493och7b", "the-hitchhiker.-lyfdwn1j", "Leon S Kennedy - Resident Evil", "Edward Hart", "Kazuko", "Angy", "jane-31ygf8x6", "Abigail", "Miguel O'Hara", "Dr. Wilbur Nogard", "Beautiful stranger", "Susan", "Tomoko", "Hinata Hyuga"]


export default async function handler(req, res) {
  // Final Results
  var botsList = []

  try {
    console.log("Loading Bots...")

    // Get Firestore instance
    const db = admin.firestore()

    // Iterate over the predefined usernames
    for (let i = 0; i < predefinedUsernames.length; i++) {
      const username = predefinedUsernames[i]

      // Query the 'bots' collection where the 'username' field matches the bot's username
      const q = db.collection('bots').where('username', '==', username)
      const querySnapshot = await q.get()

      // If a matching bot document is found, add its data to the bots list
      querySnapshot.forEach((doc) => {
        botsList.push(doc.data())
      })
    }

    // Write bots data to a JSON file
    const filePath = path.join('./public', '/topSafe.json')
    try {
      fs.writeFileSync(filePath, JSON.stringify(botsList))
      console.log("Bots Data Added!")
      res.status(200).json(botsList)
    } catch (error) {
      console.error('File writing failed:', error)
      res.status(500).json({ error: 'File writing failed' })
    }
  } catch (error) {
    console.error('Error fetching Bots:', error)
    res.status(500).json({ error: 'Unable to fetch bots' })
  }
}
