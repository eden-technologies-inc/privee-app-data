import { admin } from '@/lib/firebaseAdmin'
import fs from 'fs'
import path from 'path'

// Predefined array of usernames
const predefinedUsernames = ["Maddy", "jennifer-tuck-xy0xpvd0", "Angy", "Linda", "bluebell-academy-o2h32meh", "Hanako (Your Horny Futanari Mommy)", "Sujin (Strict Asian Mum)", "Teresa (Your Swimming Pal)", "jane-31ygf8x6", "Abigail", "Yui Ogoyaki", "Katrina Lure", "Leon S Kennedy - Resident Evil", "Edward Hart", "Dr. Wilbur Nogard", "Beautiful stranger", "Kia Rowland", "Susan", "goldie-e6xhqp4s", "Angy", "ann-e2in11j6", "Naomi Lapaglia", "Miguel O'Hara", "Emiko Yume"];

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
    const filePath = path.join('./public', '/top.json')
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
