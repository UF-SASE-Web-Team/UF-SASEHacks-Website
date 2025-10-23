import { z } from "zod";

export const tshirtOptions = ["XS","S","M","L","XL","2XL","3XL"] as const;
export const dietaryOptions = [
  "vegan","vegetarian","halal","kosher","nut-free","gluten-free","dairy-free","none"
] as const;
export const gradYearOptions = ["2025","2026","2027","2028","2029","2030"] as const;
export const levelOfStudyOptions = ["undergraduate","graduate"] as const;
export const skillLevelOptions = ["1","2","3","4","5"] as const;
export const hackathonExperienceOptions = ["0","1","2","3","4","5+"] as const;
export const genderOptions = ["male","female","non-binary","other","prefer-not-to-say"] as const;
export const raceOptions = [
  "american-indian-or-alaska-native",
  "asian",
  "black-or-african-american",
  "hispanic-or-latino",
  "native-hawaiian-or-pacific-islander",
  "white",
  "other",
  "prefer-not-to-say"
] as const;

export const profileSchema = z.object({
  full_name: z.string().min(2, "Please enter your full name"),
  email: z.string().email(),
  phone_number: z.string().min(10, "Please enter a valid phone number"),
  date_of_birth: z.string().min(1, "Please enter your date of birth"),

  school: z.string().min(2, "Please enter your school"),
  major: z.string().min(2, "Please enter your field/major"),
  grad_year: z.enum(gradYearOptions),
  level_of_study: z.enum(levelOfStudyOptions),

  engineering_skill: z.enum(skillLevelOptions),
  hackathon_experience: z.enum(hackathonExperienceOptions),

  address_line1: z.string().min(3, "Please enter your address"),
  address_line2: z.string(),
  city: z.string().min(2, "Please enter your city"),
  state: z.string().min(2, "Please enter your state/province"),
  zip_code: z.string().min(3, "Please enter your zip/postal code"),
  country: z.string().min(2, "Please enter your country"),

  tshirt: z.enum(tshirtOptions),
  dietary: z.array(z.enum(dietaryOptions)),
  accessibility: z.string(),

  gender: z.enum(genderOptions),
  race: z.array(z.enum(raceOptions)),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export const registrationFlagsSchema = z.object({
  accuracy_agreement: z.boolean().refine(val => val === true, "You must agree to the accuracy statement"),
  terms_and_conditions: z.boolean().refine(val => val === true, "You must agree to the terms and conditions"),
  code_of_conduct: z.boolean().refine(val => val === true, "You must agree to the code of conduct"),
  can_photograph: z.boolean().default(false),
});
export type RegistrationFlagsValues = z.infer<typeof registrationFlagsSchema>;
