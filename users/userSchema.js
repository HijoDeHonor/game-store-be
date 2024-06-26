import z from "zod";

const userSchema = z.object({
  userName: z.string()
    .min(1, { message: 'UserName is required.' })
    .refine(value => !value.includes(' '), { message: 'UserName must not contain spaces' }),
  password: z.string()
    .min(1, { message: 'Password is required.' })
    .refine(value => !value.includes(' '), { message: 'Password must not contain spaces' }),
});

export const validateUser = (userName, password) => {
  const input = { userName, password }

  return userSchema.safeParse(input);
}




// if (!userName || !password) return false;
// if (typeof userName !== 'string' || typeof password !== 'string') return false;
// if (userName === '' || password === '') return false;
// if (userName.includes(' ') || password.includes(' ')) return false