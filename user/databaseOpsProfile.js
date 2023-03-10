'use strict'

const dbp = require('./sqlWrapProfile');
const insertDBP = "insert into Profile (id, givenName) values (?,?)";
const findName = "select id from Profile where givenName = ? ";
// const deleteAllDBP = "DELETE * FROM Profile";

module.exports = {
  insertProfile: insertProfile,
  getName: getName
}

async function insertProfile(idNum,firstName) {
  try {
    let usrExist = await searchDuplicate(idNum,firstName);
    console.log("usrExist: ",usrExist);
    if(!usrExist.userExist) {
      console.log("attempting to insert profile...");
      await dbp.run(insertDBP, [idNum,firstName]);
    }

    // await dbp.deleteEverything();
    let all = await print_all();
    console.log("all profile data: ",all);
  } catch (error) {
    console.log("insertProfile error", error)
  }
}

async function getName(name) {
  let result = await dbp.get(findName,[name]);
  console.log("getName result: ",result.id);
  return result.id;
}

async function searchDuplicate(idNum,firstName) {
  const searchExist = `SELECT EXISTS(SELECT 1 FROM Profile WHERE id = ${idNum}) as userExist`;
  let exist = await dbp.get(searchExist);
  console.log("exist? ",exist);
  return exist;
}

async function print_all() {
  try {
    let results = await dbp.all("select * from Profile", []);
    return results;
  } 
  catch (error) {
    console.log(error);
    return [];
  }
}
