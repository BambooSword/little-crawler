import axios from 'axios'
import fs from 'fs/promises'
axios
  .get(
    'http://restapi.amap.com/v3/config/district?key=acbc4fb33d656b682b5497551356ae62&subdistrict=3'
  )
  .then(json => json.data)
  .then(s => {
    console.log('🚀 ~ file: getlocation.ts:9 ~ s:', s.districts[0].districts)
    fs.writeFile(
      'location.json',
      JSON.stringify(s.districts[0].districts),
      'utf8'
    )
  })
