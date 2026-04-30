import { users, User, Name, Location } from './Users'

console.log(users[0])

const countCharTypes = (password: string): number => {
  let types = 0
  if (/[a-z]/.test(password)) 
    types++
  if (/[A-Z]/.test(password)) 
    types++
  if (/[0-9]/.test(password)) 
    types++
  if (/[^a-zA-Z0-9]/.test(password)) 
    types++
  return types
}
/* A function that determines if a password is weak. A password is weak if it has only 
lowercase letters and is less than 8 characters long. */
const isWeakPassword = (password: string): boolean => {
  return /^[a-z]+$/.test(password) && password.length < 8
}

/*A function that determines if a password is strong. A password is strong if it is at 
least 30 characters long, or if it is at least 15 characters and does not contain only 
lowercase letters, or if it is more than 10 characters and contains 3 types of 
characters (lowercase, uppercase, digits, or special characters). */
const isStrongPassword = (password: string): boolean => {
  if (password.length >= 30) 
    return true
  if (password.length >= 15 && !/^[a-z]+$/.test(password)) 
    return true
  if (password.length > 10 && countCharTypes(password) >= 3) 
    return true
  return false
}

/*A function that returns the name of all the users that have a weak password.*/
const getUsersWithWeakPasswords = (userList: User[]): string[] => {
  return userList
    .filter(user => isWeakPassword(user.login.password))
    .map(user => user.name.toString())
}

/*A function that returns an object with three counts: the number of users that have 
a weak password, the number of users that have a strong password, the number 
of users that have a password of medium difficulty.*/
const getPasswordCounts = (userList: User[]): { weak: number; strong: number; medium: number } => {
  const weak = userList.filter(user => isWeakPassword(user.login.password)).length
  const strong = userList.filter(user => isStrongPassword(user.login.password)).length
  const medium = userList.length - weak - strong
  return { weak, strong, medium }
}

/*A function that resets all weak passwords: all users with a weak password have their 
password changed to "pleaseupdateyourpassword" (in practice, this is probably a 
terrible idea!). */
const resetWeakPasswords = (userList: User[]): User[] => {
  return userList.map(user =>
    isWeakPassword(user.login.password)
      ? { ...user, login: { ...user.login, password: 'pleaseupdateyourpassword' } }
      : user
  )
}

//A function that sorts the users by their age.
const sortUsersByAge = (userList: User[]): User[] => {
  return [...userList].sort((a, b) => a.birthdate.age - b.birthdate.age)
}

//A function that counts all the nationalities present in the data.
const countNationalities = (userList: User[]): Record<string, number> => {
  return userList.reduce<Record<string, number>>((acc, user) => {
    acc[user.nationality] = (acc[user.nationality] ?? 0) + 1
    return acc
  }, {})
}

/*A function that returns the users that do NOT have an email at 
the example.com domain.*/
const getUsersWithoutExampleComEmail = (userList: User[]): User[] => {
  return userList.filter(user => !user.email.endsWith('@example.com'))
}

/* A function that returns the most common domain name for emails that is 
not example.com */
const getMostCommonNonExampleComDomain = (userList: User[]): string => {
  const counts = new Map<string, number>();

  for (const { email } of userList) {
    if (!email.endsWith('@example.com')) {
      const domain = email.split('@')[1];
      counts.set(domain, (counts.get(domain) ?? 0) + 1);
    } 
  } 

  let bestDomain = '';
  let maxCount = 0;

  for (const [domain, count] of counts) {
    if (count > maxCount) {
      bestDomain = domain;
      maxCount = count;
    }
  }

  return bestDomain;
}

// A function that returns the locations of the users that are German. 
const getGermanUserLocations = (userList: User[]): Location[] => {
  return userList
    .filter(user => user.nationality === 'DE')
    .map(user => user.location)
}

// A function that returns the users who have a postcode that is not a number
const getUsersWithNonNumericPostcode = (userList: User[]): User[] => {
  return userList.filter(user => isNaN(Number(user.location.postcode)))
}

/*A function that returns the names and emails of the users who have an email 
address that do not contain there first or last name. */
const getUsersWithoutNameInEmail = (userList: User[]): { name: Name; email: string }[] => {
  return userList
    .filter(user => {
      const email = user.email.toLowerCase()
      const first = user.name.first.toLowerCase()
      const last = user.name.last.toLowerCase()
      return !email.includes(first) && !email.includes(last)
    })
    .map(user => ({ name: user.name, email: user.email }))
}

/*A function that returns the names of the users who do not have a valid ID. */
const getUsersWithInvalidId = (userList: User[]): { name: Name }[] => {
  return userList
    .filter(user => {
      const { name, value } = user.id
      if (value === null || name === '') return true
      if (value.includes('NaN') || value.includes('undefined')) return true
      return false
    })
    .map(user => ({ name: user.name }))
}


console.log('isWeakPassword("superStrong2#454rrffdg43"):', isWeakPassword('superStrong2#454rrffdg43'))
console.log('isStrongPassword("short"):', isStrongPassword('short'))
console.log('isStrongPassword("journeytoaverylongpasswordthatmightbestrongenough"):', isStrongPassword('journeytoaverylongpasswordthatmightbestrongenough'))
console.log('getUsersWithWeakPasswords(users):', getUsersWithWeakPasswords(users))
console.log('getPasswordCounts(users):', getPasswordCounts(users))
console.log('resetWeakPasswords(users).slice(0, 5).map(u => ({ name, password })):', resetWeakPasswords(users).slice(0, 5).map(u => ({ name: `${u.name.first} ${u.name.last}`, password: u.login.password })))
console.log('sortUsersByAge(users).slice(0, 5).map(u => ({ name, age })):', sortUsersByAge(users).slice(0, 5).map(u => ({ name: `${u.name.first} ${u.name.last}`, age: u.birthdate.age })))
console.log('countNationalities(users):', countNationalities(users))
console.log('getUsersWithoutExampleComEmail(users).map(u => u.email):', getUsersWithoutExampleComEmail(users).map(u => u.email))
console.log('getMostCommonNonExampleComDomain(users):', getMostCommonNonExampleComDomain(users))
console.log('getGermanUserLocations(users).map(l => `${l.city}, ${l.country}`):', getGermanUserLocations(users).map(l => `${l.city}, ${l.country}`))
console.log('getUsersWithNonNumericPostcode(users).map(u => ({ name, postcode })):', getUsersWithNonNumericPostcode(users).map(u => ({ name: `${u.name.first} ${u.name.last}`, postcode: u.location.postcode })))
console.log('getUsersWithoutNameInEmail(users):', getUsersWithoutNameInEmail(users))
console.log('getUsersWithInvalidId(users).map(u => name):', getUsersWithInvalidId(users).map(u => `${u.name.first} ${u.name.last}`))
