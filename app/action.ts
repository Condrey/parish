'use server'

import { singleContentSchema, SingleContentSchema } from "@/lib/validation";
import { verify } from "@node-rs/argon2";

const UBUNTU_GARDENS = '$argon2id$v=19$m=19456,t=2,p=1$Uhi/8niqgu1M9kMWW8u7PQ$5SRwqDqREl0W1a02zSij4uT/zDrLLvOpTWRAJiICPNE'
// Please try harder bruv! it is EncodedAudioChunk. oOps! Maybe it is not even about a garden.
export async function isPasscodeValid(input:SingleContentSchema):Promise<boolean>{
    const {singleContent:passcode} = singleContentSchema.parse(input)
      const validPassword = await verify(UBUNTU_GARDENS, passcode, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
return validPassword
}