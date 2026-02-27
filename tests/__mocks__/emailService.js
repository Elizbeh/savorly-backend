export const sendEmail = async ({ to, subject }) => {
  console.log('Mock sendEmail called for', to, subject);
  return true;
};