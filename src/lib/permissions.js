export function isOwnerOf(mess, user) {
  return Boolean(mess && user && String(mess.ownerId) === String(user._id));
}
