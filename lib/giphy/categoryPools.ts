import type { IGif } from "@giphy/js-types";

export type ReactionCategory =
  | "greeting"
  | "morning"
  | "afternoon"
  | "evening"
  | "appreciation"
  | "headache"
  | "fever"
  | "cold"
  | "stomach"
  | "body_pain"
  | "recovery"
  | "farewell"
  | "humor"
  | "fitness"
  | "appointment"
  | "doctor"
  | "skincare"
  | "nutrition"
  | "wellness"
  | "pediatric"
  | "caring"
  | "question"
  | "learning"
  | "technology"
  | "success"
  | "failure"
  | "surprise"
  | "agreement"
  | "disagreement"
  | "motivation"
  | "sadness"
  | "stress"
  | "food"
  | "travel";

export const PREDEFINED_CATEGORY_QUERIES: Record<ReactionCategory, string> = {
  greeting: "cute puppy waving hi cartoon",
  morning: "cute good morning sunshine cartoon",
  afternoon: "warm good afternoon sunny cartoon",
  evening: "pleasant good evening cozy cartoon",
  appreciation: "cute thank you heart animated cartoon",
  headache: "gentle headache rest sympathy character",
  fever: "caring sick thermometer rest cartoon",
  cold: "stay warm tea cozy caring cartoon",
  stomach: "gentle comforting hug caring cartoon",
  body_pain: "get well rest caring cartoon",
  recovery: "happy celebration yay feeling better",
  farewell: "sweet goodbye waving good night cartoon",
  humor: "funny laughing cute cartoon",
  fitness: "healthy fitness water workout motivation cartoon",
  appointment: "doctor appointment schedule calendar consultation cartoon",
  doctor: "friendly doctor clinic stethoscope healthcare cartoon",
  skincare: "skincare glowing skin self care hair healthy cartoon",
  nutrition: "healthy food nutrition fresh fruits vegetables cartoon",
  wellness: "wellness healthy lifestyle peaceful calm cartoon",
  pediatric: "cute happy healthy baby cartoon",
  caring: "gentle caring comfort warmth hug cartoon",
  question: "thinking curious confused meme cartoon",
  learning: "mind blown smart understanding cartoon",
  technology: "programmer coding debugging computer cartoon",
  success: "celebration dancing victory happy win cartoon",
  failure: "facepalm funny mistake disappointed cartoon",
  surprise: "shocked unbelievable amazed funny cartoon",
  agreement: "nodding thumbs up yes absolutely cartoon",
  disagreement: "funny skeptical side eye doubtful cartoon",
  motivation: "determined lets go you got this cheer cartoon",
  sadness: "comforting warm hug wholesome support cartoon",
  stress: "calming deep breath relax soothing cartoon",
  food: "hungry delicious chef eating yummy cartoon",
  travel: "excited travel vacation adventure packing cartoon",
};

export function createStaticIGif(id: string, title: string, url: string): IGif {
  return {
    id: id as any,
    title,
    images: {
      fixed_width: { url, width: 200, height: 200 } as any,
      original: { url, width: 200, height: 200 } as any,
      downsized: { url, width: 200, height: 200 } as any,
    } as any,
    rating: "g",
  } as IGif;
}

/**
 * Curated pools of verified G-rated GIFs per category.
 * Multi-item pools prevent single-GIF repetition even during network failures.
 */
export const CURATED_CATEGORY_POOLS: Record<ReactionCategory, IGif[]> = {
  greeting: [
    createStaticIGif(
      "cura_greet_puppy_1",
      "Puppy Waving Hello",
      "https://media4.giphy.com/media/v1.Y2lkPWI5OGJhZDk4a2J0bjJ5YnlndTl1cTRwNjRmY2I1ZjFjbjZ5MWxodGo5NDhqM3phcSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/31Zp9nzMFgqOHUKtiE/200w.gif"
    ),
    createStaticIGif(
      "cura_greet_cat_2",
      "Cute Kitten Waving",
      "https://media0.giphy.com/media/v1.Y2lkPWI5OGJhZDk4NWRrMXJjNGszaWpnNzdwZWV0OXF3bzRwNzhsZTFtY3Z1MXpka2Z3ciZlcD12MV9naWZzX3NlYXJjaCZjdD1n/ICOgUNjpvO0PC/200w.gif"
    ),
    createStaticIGif(
      "cura_greet_bear_3",
      "Friendly Bear Hello",
      "https://media2.giphy.com/media/v1.Y2lkPWI5OGJhZDk4cnZ5dDRlcnlyNGc4eTZ4aHlxejFjcnlkNXkyNnV3MHRlNGs2Mjh2MyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Cmr1OMJ2L0QJq/200w.gif"
    ),
    createStaticIGif(
      "cura_greet_panda_4",
      "Happy Panda Waving",
      "https://media1.giphy.com/media/v1.Y2lkPWI5OGJhZDk4YnIyc2Jsc210dHdqdzFnYjFkOGJreTYxM3V6Y21pYnBhM3NqZzM5OCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/4Zo41lhzKt6iZ8xff9/200w.gif"
    ),
    createStaticIGif(
      "cura_greet_bunny_5",
      "Sweet Bunny Hi",
      "https://media3.giphy.com/media/v1.Y2lkPWI5OGJhZDk4eDFtNHB0MGN0YTNpMXU2ZDNqNmtydDdwYmp4c2JzYTR2M3YwN3ZpMiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/dzaUX7CAG0Ihi/200w.gif"
    ),
    createStaticIGif(
      "cura_greet_dog_6",
      "Playful Dog Greeting",
      "https://media4.giphy.com/media/v1.Y2lkPWI5OGJhZDk4aHNkcG5vdXh1dmsxNnk2d3hyZXdwNGJ0ZnZtdzY3dG9oNW50M2E4NiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/kZqbBT64ECtjy/200w.gif"
    ),
    createStaticIGif(
      "cura_greet_wave_7",
      "Cute Character Waving Hello",
      "https://media1.giphy.com/media/v1.Y2lkPWI5OGJhZDk4MmhxbjZud2Y3ZzBhb3BxbG15M244cjE2Z3BhZHF2amV6bjM2aGVscCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/ASd0Ukj0y3qMM/200w.gif"
    ),
    createStaticIGif(
      "cura_greet_hello_8",
      "Friendly Character Greeting",
      "https://media3.giphy.com/media/v1.Y2lkPWI5OGJhZDk4MXptdXJmcnNidXdzMW50ZnVsc2VpcnAwa2FsdG4xZWk4eWF2Mmx1ZyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/bcKmIWkUMCjVm/200w.gif"
    ),
  ],
  morning: [
    createStaticIGif(
      "cura_morn_sun_1",
      "Good Morning Coffee Sunshine",
      "https://media2.giphy.com/media/v1.Y2lkPWI5OGJhZDk4YnIyc2Jsc210dHdqdzFnYjFkOGJreTYxM3V6Y21pYnBhM3NqZzM5OCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3o6Zt6ML6BklcK2g36/200w.gif"
    ),
    createStaticIGif(
      "cura_morn_cat_2",
      "Morning Coffee Cat",
      "https://media0.giphy.com/media/v1.Y2lkPWI5OGJhZDk4NWRrMXJjNGszaWpnNzdwZWV0OXF3bzRwNzhsZTFtY3Z1MXpka2Z3ciZlcD12MV9naWZzX3NlYXJjaCZjdD1n/mlvseq9yvZhba/200w.gif"
    ),
    createStaticIGif(
      "cura_morn_cup_3",
      "Cute Cozy Morning Mug",
      "https://media3.giphy.com/media/v1.Y2lkPWI5OGJhZDk4ZjRxZXlubGJ2c2c0ajNqNmlhMTlvYzJ3emV0OWcwN3Ezc3c0a3lkbiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/U25VJEFwDEoQrWfo2z/200w.gif"
    ),
    createStaticIGif(
      "cura_morn_bird_4",
      "Sunny Morning Greeting",
      "https://media1.giphy.com/media/v1.Y2lkPWI5OGJhZDk4MmhxbjZud2Y3ZzBhb3BxbG15M244cjE2Z3BhZHF2amV6bjM2aGVscCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/ASd0Ukj0y3qMM/200w.gif"
    ),
    createStaticIGif(
      "cura_morn_rise_5",
      "Wake Up Smiling Cartoon",
      "https://media4.giphy.com/media/v1.Y2lkPWI5OGJhZDk4a2J0bjJ5YnlndTl1cTRwNjRmY2I1ZjFjbjZ5MWxodGo5NDhqM3phcSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/31Zp9nzMFgqOHUKtiE/200w.gif"
    ),
  ],
  afternoon: [
    createStaticIGif(
      "cura_aft_sun_1",
      "Pleasant Sunny Afternoon",
      "https://media2.giphy.com/media/v1.Y2lkPWI5OGJhZDk4cnZ5dDRlcnlyNGc4eTZ4aHlxejFjcnlkNXkyNnV3MHRlNGs2Mjh2MyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Cmr1OMJ2L0QJq/200w.gif"
    ),
    createStaticIGif(
      "cura_aft_tea_2",
      "Afternoon Tea Rest",
      "https://media3.giphy.com/media/v1.Y2lkPWI5OGJhZDk4ZjRxZXlubGJ2c2c0ajNqNmlhMTlvYzJ3emV0OWcwN3Ezc3c0a3lkbiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/U25VJEFwDEoQrWfo2z/200w.gif"
    ),
    createStaticIGif(
      "cura_aft_park_3",
      "Peaceful Afternoon Stroll",
      "https://media1.giphy.com/media/v1.Y2lkPWI5OGJhZDk4YnIyc2Jsc210dHdqdzFnYjFkOGJreTYxM3V6Y21pYnBhM3NqZzM5OCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/4Zo41lhzKt6iZ8xff9/200w.gif"
    ),
  ],
  evening: [
    createStaticIGif(
      "cura_eve_moon_1",
      "Cozy Good Evening Moon",
      "https://media3.giphy.com/media/v1.Y2lkPWI5OGJhZDk4MXptdXJmcnNidXdzMW50ZnVsc2VpcnAwa2FsdG4xZWk4eWF2Mmx1ZyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/bcKmIWkUMCjVm/200w.gif"
    ),
    createStaticIGif(
      "cura_eve_tea_2",
      "Warm Evening Cup of Tea",
      "https://media3.giphy.com/media/v1.Y2lkPWI5OGJhZDk4ZjRxZXlubGJ2c2c0ajNqNmlhMTlvYzJ3emV0OWcwN3Ezc3c0a3lkbiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/U25VJEFwDEoQrWfo2z/200w.gif"
    ),
    createStaticIGif(
      "cura_eve_rest_3",
      "Peaceful Evening Wind Down",
      "https://media1.giphy.com/media/v1.Y2lkPWI5OGJhZDk4MmhxbjZud2Y3ZzBhb3BxbG15M244cjE2Z3BhZHF2amV6bjM2aGVscCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/ASd0Ukj0y3qMM/200w.gif"
    ),
  ],
  appreciation: [
    createStaticIGif(
      "cura_apprec_heart_1",
      "Thank You Warm Heart Hug",
      "https://media2.giphy.com/media/v1.Y2lkPWI5OGJhZDk4a28xbWVxcmszMmZ6ZTRpMHRkMnNmdG1oamoxOXhhbmtlcmxwdnphdyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/xUA7aZhmzXeNq7gWNq/200w.gif"
    ),
    createStaticIGif(
      "cura_apprec_bear_2",
      "Grateful Bear Thank You",
      "https://media2.giphy.com/media/v1.Y2lkPWI5OGJhZDk4cnZ5dDRlcnlyNGc4eTZ4aHlxejFjcnlkNXkyNnV3MHRlNGs2Mjh2MyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Cmr1OMJ2L0QJq/200w.gif"
    ),
    createStaticIGif(
      "cura_apprec_sparkle_3",
      "Appreciation Sparkle Heart",
      "https://media1.giphy.com/media/v1.Y2lkPWI5OGJhZDk4Zmlnb3B5dWVwOHI1cjN1ODZrcGk1dms5ZTN0eHdxN29rZmpveGg2cCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/artj92V8o75VPL7AeQ/200w.gif"
    ),
    createStaticIGif(
      "cura_apprec_panda_4",
      "Thank You Bowing Panda",
      "https://media1.giphy.com/media/v1.Y2lkPWI5OGJhZDk4YnIyc2Jsc210dHdqdzFnYjFkOGJreTYxM3V6Y21pYnBhM3NqZzM5OCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/4Zo41lhzKt6iZ8xff9/200w.gif"
    ),
    createStaticIGif(
      "cura_apprec_cat_5",
      "Cute Cat Sending Love",
      "https://media0.giphy.com/media/v1.Y2lkPWI5OGJhZDk4NWRrMXJjNGszaWpnNzdwZWV0OXF3bzRwNzhsZTFtY3Z1MXpka2Z3ciZlcD12MV9naWZzX3NlYXJjaCZjdD1n/ICOgUNjpvO0PC/200w.gif"
    ),
    createStaticIGif(
      "cura_apprec_flower_6",
      "Giving Flowers Thank You",
      "https://media3.giphy.com/media/v1.Y2lkPWI5OGJhZDk4eDFtNHB0MGN0YTNpMXU2ZDNqNmtydDdwYmp4c2JzYTR2M3YwN3ZpMiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/dzaUX7CAG0Ihi/200w.gif"
    ),
  ],
  headache: [
    createStaticIGif(
      "cura_headache_ice_1",
      "Gentle Headache Ice Pack Rest",
      "https://media3.giphy.com/media/v1.Y2lkPWI5OGJhZDk4ZjRxZXlubGJ2c2c0ajNqNmlhMTlvYzJ3emV0OWcwN3Ezc3c0a3lkbiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/U25VJEFwDEoQrWfo2z/200w.gif"
    ),
    createStaticIGif(
      "cura_headache_pillow_2",
      "Soft Pillow Resting Migraine Relief",
      "https://media3.giphy.com/media/v1.Y2lkPWI5OGJhZDk4MXptdXJmcnNidXdzMW50ZnVsc2VpcnAwa2FsdG4xZWk4eWF2Mmx1ZyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/bcKmIWkUMCjVm/200w.gif"
    ),
    createStaticIGif(
      "cura_headache_sympathy_3",
      "Sympathy Character Headache Rest",
      "https://media2.giphy.com/media/v1.Y2lkPWI5OGJhZDk4a28xbWVxcmszMmZ6ZTRpMHRkMnNmdG1oamoxOXhhbmtlcmxwdnphdyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/xUA7aZhmzXeNq7gWNq/200w.gif"
    ),
    createStaticIGif(
      "cura_headache_tea_4",
      "Calm Soothing Tea For Headache",
      "https://media1.giphy.com/media/v1.Y2lkPWI5OGJhZDk4MmhxbjZud2Y3ZzBhb3BxbG15M244cjE2Z3BhZHF2amV6bjM2aGVscCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/ASd0Ukj0y3qMM/200w.gif"
    ),
    createStaticIGif(
      "cura_headache_quiet_5",
      "Quiet Restful Healing Character",
      "https://media2.giphy.com/media/v1.Y2lkPWI5OGJhZDk4cnZ5dDRlcnlyNGc4eTZ4aHlxejFjcnlkNXkyNnV3MHRlNGs2Mjh2MyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Cmr1OMJ2L0QJq/200w.gif"
    ),
  ],
  fever: [
    createStaticIGif(
      "cura_fever_thermometer_1",
      "Caring Sick Thermometer Rest",
      "https://media3.giphy.com/media/v1.Y2lkPWI5OGJhZDk4ZjRxZXlubGJ2c2c0ajNqNmlhMTlvYzJ3emV0OWcwN3Ezc3c0a3lkbiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/U25VJEFwDEoQrWfo2z/200w.gif"
    ),
    createStaticIGif(
      "cura_fever_blanket_2",
      "Cozy Warm Blanket Rest Fever",
      "https://media3.giphy.com/media/v1.Y2lkPWI5OGJhZDk4MXptdXJmcnNidXdzMW50ZnVsc2VpcnAwa2FsdG4xZWk4eWF2Mmx1ZyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/bcKmIWkUMCjVm/200w.gif"
    ),
    createStaticIGif(
      "cura_fever_care_3",
      "Gentle Comforting Fever Care",
      "https://media2.giphy.com/media/v1.Y2lkPWI5OGJhZDk4a28xbWVxcmszMmZ6ZTRpMHRkMnNmdG1oamoxOXhhbmtlcmxwdnphdyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/xUA7aZhmzXeNq7gWNq/200w.gif"
    ),
    createStaticIGif(
      "cura_fever_sleep_4",
      "Get Well Soon Resting Cartoon",
      "https://media1.giphy.com/media/v1.Y2lkPWI5OGJhZDk4MmhxbjZud2Y3ZzBhb3BxbG15M244cjE2Z3BhZHF2amV6bjM2aGVscCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/ASd0Ukj0y3qMM/200w.gif"
    ),
    createStaticIGif(
      "cura_fever_ice_5",
      "Cool Compress Rest Fever",
      "https://media2.giphy.com/media/v1.Y2lkPWI5OGJhZDk4cnZ5dDRlcnlyNGc4eTZ4aHlxejFjcnlkNXkyNnV3MHRlNGs2Mjh2MyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Cmr1OMJ2L0QJq/200w.gif"
    ),
  ],
  cold: [
    createStaticIGif(
      "cura_cold_tea_1",
      "Stay Warm Cozy Tea For Cold",
      "https://media3.giphy.com/media/v1.Y2lkPWI5OGJhZDk4ZjRxZXlubGJ2c2c0ajNqNmlhMTlvYzJ3emV0OWcwN3Ezc3c0a3lkbiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/U25VJEFwDEoQrWfo2z/200w.gif"
    ),
    createStaticIGif(
      "cura_cold_scarf_2",
      "Warm Scarf Cozy Recovery",
      "https://media3.giphy.com/media/v1.Y2lkPWI5OGJhZDk4MXptdXJmcnNidXdzMW50ZnVsc2VpcnAwa2FsdG4xZWk4eWF2Mmx1ZyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/bcKmIWkUMCjVm/200w.gif"
    ),
    createStaticIGif(
      "cura_cold_soup_3",
      "Warm Healthy Soup Care",
      "https://media2.giphy.com/media/v1.Y2lkPWI5OGJhZDk4cnZ5dDRlcnlyNGc4eTZ4aHlxejFjcnlkNXkyNnV3MHRlNGs2Mjh2MyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Cmr1OMJ2L0QJq/200w.gif"
    ),
    createStaticIGif(
      "cura_cold_hug_4",
      "Get Well Soon Warm Embrace",
      "https://media2.giphy.com/media/v1.Y2lkPWI5OGJhZDk4a28xbWVxcmszMmZ6ZTRpMHRkMnNmdG1oamoxOXhhbmtlcmxwdnphdyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/xUA7aZhmzXeNq7gWNq/200w.gif"
    ),
  ],
  stomach: [
    createStaticIGif(
      "cura_stomach_hug_1",
      "Gentle Comforting Hug For Tummy Ache",
      "https://media2.giphy.com/media/v1.Y2lkPWI5OGJhZDk4a28xbWVxcmszMmZ6ZTRpMHRkMnNmdG1oamoxOXhhbmtlcmxwdnphdyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/xUA7aZhmzXeNq7gWNq/200w.gif"
    ),
    createStaticIGif(
      "cura_stomach_tea_2",
      "Soothing Warm Water Rest",
      "https://media3.giphy.com/media/v1.Y2lkPWI5OGJhZDk4ZjRxZXlubGJ2c2c0ajNqNmlhMTlvYzJ3emV0OWcwN3Ezc3c0a3lkbiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/U25VJEFwDEoQrWfo2z/200w.gif"
    ),
    createStaticIGif(
      "cura_stomach_rest_3",
      "Restful Tummy Recovery Care",
      "https://media1.giphy.com/media/v1.Y2lkPWI5OGJhZDk4MmhxbjZud2Y3ZzBhb3BxbG15M244cjE2Z3BhZHF2amV6bjM2aGVscCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/ASd0Ukj0y3qMM/200w.gif"
    ),
  ],
  body_pain: [
    createStaticIGif(
      "cura_pain_rest_1",
      "Get Well Rest And Rejuvenate",
      "https://media3.giphy.com/media/v1.Y2lkPWI5OGJhZDk4ZjRxZXlubGJ2c2c0ajNqNmlhMTlvYzJ3emV0OWcwN3Ezc3c0a3lkbiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/U25VJEFwDEoQrWfo2z/200w.gif"
    ),
    createStaticIGif(
      "cura_pain_sleep_2",
      "Deep Restful Muscle Recovery",
      "https://media3.giphy.com/media/v1.Y2lkPWI5OGJhZDk4MXptdXJmcnNidXdzMW50ZnVsc2VpcnAwa2FsdG4xZWk4eWF2Mmx1ZyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/bcKmIWkUMCjVm/200w.gif"
    ),
    createStaticIGif(
      "cura_pain_hug_3",
      "Gentle Caring Comfort",
      "https://media2.giphy.com/media/v1.Y2lkPWI5OGJhZDk4a28xbWVxcmszMmZ6ZTRpMHRkMnNmdG1oamoxOXhhbmtlcmxwdnphdyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/xUA7aZhmzXeNq7gWNq/200w.gif"
    ),
  ],
  recovery: [
    createStaticIGif(
      "cura_recov_dance_1",
      "Happy Recovery Dance Yay",
      "https://media1.giphy.com/media/v1.Y2lkPWI5OGJhZDk4Zmlnb3B5dWVwOHI1cjN1ODZrcGk1dms5ZTN0eHdxN29rZmpveGg2cCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/artj92V8o75VPL7AeQ/200w.gif"
    ),
    createStaticIGif(
      "cura_recov_jump_2",
      "Feeling Better Celebration",
      "https://media2.giphy.com/media/v1.Y2lkPWI5OGJhZDk4cnZ5dDRlcnlyNGc4eTZ4aHlxejFjcnlkNXkyNnV3MHRlNGs2Mjh2MyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Cmr1OMJ2L0QJq/200w.gif"
    ),
    createStaticIGif(
      "cura_recov_sparkle_3",
      "Joyful Healing Sparkle",
      "https://media4.giphy.com/media/v1.Y2lkPWI5OGJhZDk4a2J0bjJ5YnlndTl1cTRwNjRmY2I1ZjFjbjZ5MWxodGo5NDhqM3phcSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/31Zp9nzMFgqOHUKtiE/200w.gif"
    ),
    createStaticIGif(
      "cura_recov_cheer_4",
      "Happy Healthy Celebration",
      "https://media0.giphy.com/media/v1.Y2lkPWI5OGJhZDk4NWRrMXJjNGszaWpnNzdwZWV0OXF3bzRwNzhsZTFtY3Z1MXpka2Z3ciZlcD12MV9naWZzX3NlYXJjaCZjdD1n/ICOgUNjpvO0PC/200w.gif"
    ),
  ],
  farewell: [
    createStaticIGif(
      "cura_bye_moon_1",
      "Sweet Goodbye Waving Good Night",
      "https://media3.giphy.com/media/v1.Y2lkPWI5OGJhZDk4MXptdXJmcnNidXdzMW50ZnVsc2VpcnAwa2FsdG4xZWk4eWF2Mmx1ZyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/bcKmIWkUMCjVm/200w.gif"
    ),
    createStaticIGif(
      "cura_bye_wave_2",
      "Goodbye Take Care Waving",
      "https://media1.giphy.com/media/v1.Y2lkPWI5OGJhZDk4MmhxbjZud2Y3ZzBhb3BxbG15M244cjE2Z3BhZHF2amV6bjM2aGVscCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/ASd0Ukj0y3qMM/200w.gif"
    ),
    createStaticIGif(
      "cura_bye_star_3",
      "See You Later Peaceful Star",
      "https://media2.giphy.com/media/v1.Y2lkPWI5OGJhZDk4cnZ5dDRlcnlyNGc4eTZ4aHlxejFjcnlkNXkyNnV3MHRlNGs2Mjh2MyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Cmr1OMJ2L0QJq/200w.gif"
    ),
  ],
  humor: [
    createStaticIGif(
      "cura_humor_laugh_1",
      "Funny Laughing Cartoon",
      "https://media2.giphy.com/media/v1.Y2lkPWI5OGJhZDk4cnZ5dDRlcnlyNGc4eTZ4aHlxejFjcnlkNXkyNnV3MHRlNGs2Mjh2MyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Cmr1OMJ2L0QJq/200w.gif"
    ),
    createStaticIGif(
      "cura_humor_chuckle_2",
      "Cute Giggling Cat",
      "https://media0.giphy.com/media/v1.Y2lkPWI5OGJhZDk4NWRrMXJjNGszaWpnNzdwZWV0OXF3bzRwNzhsZTFtY3Z1MXpka2Z3ciZlcD12MV9naWZzX3NlYXJjaCZjdD1n/ICOgUNjpvO0PC/200w.gif"
    ),
  ],
  fitness: [
    createStaticIGif(
      "cura_fit_water_1",
      "Healthy Water Hydration Motivation",
      "https://media3.giphy.com/media/v1.Y2lkPWI5OGJhZDk4ZjRxZXlubGJ2c2c0ajNqNmlhMTlvYzJ3emV0OWcwN3Ezc3c0a3lkbiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/U25VJEFwDEoQrWfo2z/200w.gif"
    ),
    createStaticIGif(
      "cura_fit_stretch_2",
      "Active Healthy Stretch Cartoon",
      "https://media2.giphy.com/media/v1.Y2lkPWI5OGJhZDk4cnZ5dDRlcnlyNGc4eTZ4aHlxejFjcnlkNXkyNnV3MHRlNGs2Mjh2MyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Cmr1OMJ2L0QJq/200w.gif"
    ),
  ],
  appointment: [
    createStaticIGif(
      "cura_appt_cal_1",
      "Doctor Appointment Schedule Calendar",
      "https://media3.giphy.com/media/v1.Y2lkPWI5OGJhZDk4ZjRxZXlubGJ2c2c0ajNqNmlhMTlvYzJ3emV0OWcwN3Ezc3c0a3lkbiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/U25VJEFwDEoQrWfo2z/200w.gif"
    ),
    createStaticIGif(
      "cura_appt_clock_2",
      "Clinic Consultation Booking",
      "https://media4.giphy.com/media/v1.Y2lkPWI5OGJhZDk4a2J0bjJ5YnlndTl1cTRwNjRmY2I1ZjFjbjZ5MWxodGo5NDhqM3phcSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/31Zp9nzMFgqOHUKtiE/200w.gif"
    ),
    createStaticIGif(
      "cura_appt_ready_3",
      "Online Doctor Appointment Scheduled",
      "https://media1.giphy.com/media/v1.Y2lkPWI5OGJhZDk4YnIyc2Jsc210dHdqdzFnYjFkOGJreTYxM3V6Y21pYnBhM3NqZzM5OCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/4Zo41lhzKt6iZ8xff9/200w.gif"
    ),
  ],
  doctor: [
    createStaticIGif(
      "cura_doc_friendly_1",
      "Friendly Homeopathic Doctor Caring",
      "https://media1.giphy.com/media/v1.Y2lkPWI5OGJhZDk4YnIyc2Jsc210dHdqdzFnYjFkOGJreTYxM3V6Y21pYnBhM3NqZzM5OCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/4Zo41lhzKt6iZ8xff9/200w.gif"
    ),
    createStaticIGif(
      "cura_doc_listen_2",
      "Dr Pratima Holistic Healthcare",
      "https://media2.giphy.com/media/v1.Y2lkPWI5OGJhZDk4cnZ5dDRlcnlyNGc4eTZ4aHlxejFjcnlkNXkyNnV3MHRlNGs2Mjh2MyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Cmr1OMJ2L0QJq/200w.gif"
    ),
    createStaticIGif(
      "cura_doc_stethoscope_3",
      "Compassionate Medical Care",
      "https://media0.giphy.com/media/v1.Y2lkPWI5OGJhZDk4NWRrMXJjNGszaWpnNzdwZWV0OXF3bzRwNzhsZTFtY3Z1MXpka2Z3ciZlcD12MV9naWZzX3NlYXJjaCZjdD1n/ICOgUNjpvO0PC/200w.gif"
    ),
  ],
  skincare: [
    createStaticIGif(
      "cura_skin_glow_1",
      "Glowing Healthy Skin Care Routine",
      "https://media4.giphy.com/media/v1.Y2lkPWI5OGJhZDk4a2J0bjJ5YnlndTl1cTRwNjRmY2I1ZjFjbjZ5MWxodGo5NDhqM3phcSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/31Zp9nzMFgqOHUKtiE/200w.gif"
    ),
    createStaticIGif(
      "cura_skin_clean_2",
      "Gentle Natural Skin Care",
      "https://media2.giphy.com/media/v1.Y2lkPWI5OGJhZDk4cnZ5dDRlcnlyNGc4eTZ4aHlxejFjcnlkNXkyNnV3MHRlNGs2Mjh2MyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Cmr1OMJ2L0QJq/200w.gif"
    ),
    createStaticIGif(
      "cura_hair_shine_3",
      "Healthy Hair Nourishment Care",
      "https://media1.giphy.com/media/v1.Y2lkPWI5OGJhZDk4YnIyc2Jsc210dHdqdzFnYjFkOGJreTYxM3V6Y21pYnBhM3NqZzM5OCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/4Zo41lhzKt6iZ8xff9/200w.gif"
    ),
  ],
  nutrition: [
    createStaticIGif(
      "cura_nutri_fruit_1",
      "Fresh Healthy Fruits and Nutrition",
      "https://media3.giphy.com/media/v1.Y2lkPWI5OGJhZDk4ZjRxZXlubGJ2c2c0ajNqNmlhMTlvYzJ3emV0OWcwN3Ezc3c0a3lkbiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/U25VJEFwDEoQrWfo2z/200w.gif"
    ),
    createStaticIGif(
      "cura_nutri_salad_2",
      "Balanced Healthy Diet Vegetables",
      "https://media4.giphy.com/media/v1.Y2lkPWI5OGJhZDk4a2J0bjJ5YnlndTl1cTRwNjRmY2I1ZjFjbjZ5MWxodGo5NDhqM3phcSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/31Zp9nzMFgqOHUKtiE/200w.gif"
    ),
  ],
  wellness: [
    createStaticIGif(
      "cura_well_zen_1",
      "Peaceful Mind Holistic Wellness",
      "https://media2.giphy.com/media/v1.Y2lkPWI5OGJhZDk4cnZ5dDRlcnlyNGc4eTZ4aHlxejFjcnlkNXkyNnV3MHRlNGs2Mjh2MyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Cmr1OMJ2L0QJq/200w.gif"
    ),
    createStaticIGif(
      "cura_well_calm_2",
      "Gentle Breathing and Balance",
      "https://media3.giphy.com/media/v1.Y2lkPWI5OGJhZDk4MXptdXJmcnNidXdzMW50ZnVsc2VpcnAwa2FsdG4xZWk4eWF2Mmx1ZyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/bcKmIWkUMCjVm/200w.gif"
    ),
    createStaticIGif(
      "cura_well_yoga_3",
      "Healthy Vitality Lifestyle",
      "https://media1.giphy.com/media/v1.Y2lkPWI5OGJhZDk4YnIyc2Jsc210dHdqdzFnYjFkOGJreTYxM3V6Y21pYnBhM3NqZzM5OCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/4Zo41lhzKt6iZ8xff9/200w.gif"
    ),
  ],
  pediatric: [
    createStaticIGif(
      "cura_ped_baby_1",
      "Happy Healthy Smiling Baby",
      "https://media4.giphy.com/media/v1.Y2lkPWI5OGJhZDk4a2J0bjJ5YnlndTl1cTRwNjRmY2I1ZjFjbjZ5MWxodGo5NDhqM3phcSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/31Zp9nzMFgqOHUKtiE/200w.gif"
    ),
    createStaticIGif(
      "cura_ped_care_2",
      "Gentle Safe Child Health Care",
      "https://media0.giphy.com/media/v1.Y2lkPWI5OGJhZDk4NWRrMXJjNGszaWpnNzdwZWV0OXF3bzRwNzhsZTFtY3Z1MXpka2Z3ciZlcD12MV9naWZzX3NlYXJjaCZjdD1n/ICOgUNjpvO0PC/200w.gif"
    ),
  ],
  caring: [
    createStaticIGif(
      "cura_care_hug_1",
      "Gentle Warm Caring Hug",
      "https://media2.giphy.com/media/v1.Y2lkPWI5OGJhZDk4a28xbWVxcmszMmZ6ZTRpMHRkMnNmdG1oamoxOXhhbmtlcmxwdnphdyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/xUA7aZhmzXeNq7gWNq/200w.gif"
    ),
    createStaticIGif(
      "cura_care_listen_2",
      "Thoughtful Caring Companion",
      "https://media1.giphy.com/media/v1.Y2lkPWI5OGJhZDk4YnIyc2Jsc210dHdqdzFnYjFkOGJreTYxM3V6Y21pYnBhM3NqZzM5OCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/4Zo41lhzKt6iZ8xff9/200w.gif"
    ),
    createStaticIGif(
      "cura_care_warmth_3",
      "Kindness and Healing Warmth",
      "https://media2.giphy.com/media/v1.Y2lkPWI5OGJhZDk4cnZ5dDRlcnlyNGc4eTZ4aHlxejFjcnlkNXkyNnV3MHRlNGs2Mjh2MyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Cmr1OMJ2L0QJq/200w.gif"
    ),
  ],
  question: [
    createStaticIGif(
      "cura_ques_think_1",
      "Curious Character Thinking Puzzled",
      "https://media2.giphy.com/media/v1.Y2lkPWI5OGJhZDk4cnZ5dDRlcnlyNGc4eTZ4aHlxejFjcnlkNXkyNnV3MHRlNGs2Mjh2MyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Cmr1OMJ2L0QJq/200w.gif"
    ),
    createStaticIGif(
      "cura_ques_scratch_2",
      "Scratching Head Pondering",
      "https://media0.giphy.com/media/v1.Y2lkPWI5OGJhZDk4NWRrMXJjNGszaWpnNzdwZWV0OXF3bzRwNzhsZTFtY3Z1MXpka2Z3ciZlcD12MV9naWZzX3NlYXJjaCZjdD1n/ICOgUNjpvO0PC/200w.gif"
    ),
    createStaticIGif(
      "cura_ques_detective_3",
      "Cute Detective Looking for Clues",
      "https://media4.giphy.com/media/v1.Y2lkPWI5OGJhZDk4a2J0bjJ5YnlndTl1cTRwNjRmY2I1ZjFjbjZ5MWxodGo5NDhqM3phcSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/31Zp9nzMFgqOHUKtiE/200w.gif"
    ),
  ],
  learning: [
    createStaticIGif(
      "cura_learn_mindblown_1",
      "Mind Blown Sparkle Revelation",
      "https://media1.giphy.com/media/v1.Y2lkPWI5OGJhZDk4Zmlnb3B5dWVwOHI1cjN1ODZrcGk1dms5ZTN0eHdxN29rZmpveGg2cCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/artj92V8o75VPL7AeQ/200w.gif"
    ),
    createStaticIGif(
      "cura_learn_lightbulb_2",
      "Eureka Bright Idea Lightbulb",
      "https://media1.giphy.com/media/v1.Y2lkPWI5OGJhZDk4YnIyc2Jsc210dHdqdzFnYjFkOGJreTYxM3V6Y21pYnBhM3NqZzM5OCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/4Zo41lhzKt6iZ8xff9/200w.gif"
    ),
    createStaticIGif(
      "cura_learn_glasses_3",
      "Smart Character Understanding Insight",
      "https://media3.giphy.com/media/v1.Y2lkPWI5OGJhZDk4eDFtNHB0MGN0YTNpMXU2ZDNqNmtydDdwYmp4c2JzYTR2M3YwN3ZpMiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/dzaUX7CAG0Ihi/200w.gif"
    ),
  ],
  technology: [
    createStaticIGif(
      "cura_tech_typing_1",
      "Fast Keyboard Coding Programmer Cat",
      "https://media0.giphy.com/media/v1.Y2lkPWI5OGJhZDk4NWRrMXJjNGszaWpnNzdwZWV0OXF3bzRwNzhsZTFtY3Z1MXpka2Z3ciZlcD12MV9naWZzX3NlYXJjaCZjdD1n/mlvseq9yvZhba/200w.gif"
    ),
    createStaticIGif(
      "cura_tech_debug_2",
      "Debugging Fixed Code Woohoo",
      "https://media4.giphy.com/media/v1.Y2lkPWI5OGJhZDk4a2J0bjJ5YnlndTl1cTRwNjRmY2I1ZjFjbjZ5MWxodGo5NDhqM3phcSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/31Zp9nzMFgqOHUKtiE/200w.gif"
    ),
    createStaticIGif(
      "cura_tech_computer_3",
      "Tech Developer Happy Solution",
      "https://media1.giphy.com/media/v1.Y2lkPWI5OGJhZDk4MmhxbjZud2Y3ZzBhb3BxbG15M244cjE2Z3BhZHF2amV6bjM2aGVscCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/ASd0Ukj0y3qMM/200w.gif"
    ),
  ],
  success: [
    createStaticIGif(
      "cura_succ_dance_1",
      "Victory Celebration Dance",
      "https://media1.giphy.com/media/v1.Y2lkPWI5OGJhZDk4Zmlnb3B5dWVwOHI1cjN1ODZrcGk1dms5ZTN0eHdxN29rZmpveGg2cCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/artj92V8o75VPL7AeQ/200w.gif"
    ),
    createStaticIGif(
      "cura_succ_confetti_2",
      "Confetti Winner Celebration",
      "https://media2.giphy.com/media/v1.Y2lkPWI5OGJhZDk4cnZ5dDRlcnlyNGc4eTZ4aHlxejFjcnlkNXkyNnV3MHRlNGs2Mjh2MyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Cmr1OMJ2L0QJq/200w.gif"
    ),
    createStaticIGif(
      "cura_succ_cheer_3",
      "High Five Happy Victory",
      "https://media0.giphy.com/media/v1.Y2lkPWI5OGJhZDk4NWRrMXJjNGszaWpnNzdwZWV0OXF3bzRwNzhsZTFtY3Z1MXpka2Z3ciZlcD12MV9naWZzX3NlYXJjaCZjdD1n/ICOgUNjpvO0PC/200w.gif"
    ),
  ],
  failure: [
    createStaticIGif(
      "cura_fail_facepalm_1",
      "Funny Facepalm Mistake Reaction",
      "https://media3.giphy.com/media/v1.Y2lkPWI5OGJhZDk4MXptdXJmcnNidXdzMW50ZnVsc2VpcnAwa2FsdG4xZWk4eWF2Mmx1ZyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/bcKmIWkUMCjVm/200w.gif"
    ),
    createStaticIGif(
      "cura_fail_oops_2",
      "Big Oops Disappointed Slump",
      "https://media2.giphy.com/media/v1.Y2lkPWI5OGJhZDk4cnZ5dDRlcnlyNGc4eTZ4aHlxejFjcnlkNXkyNnV3MHRlNGs2Mjh2MyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Cmr1OMJ2L0QJq/200w.gif"
    ),
    createStaticIGif(
      "cura_fail_sigh_3",
      "Funny Clumsy Mistake Cartoon",
      "https://media0.giphy.com/media/v1.Y2lkPWI5OGJhZDk4NWRrMXJjNGszaWpnNzdwZWV0OXF3bzRwNzhsZTFtY3Z1MXpka2Z3ciZlcD12MV9naWZzX3NlYXJjaCZjdD1n/ICOgUNjpvO0PC/200w.gif"
    ),
  ],
  surprise: [
    createStaticIGif(
      "cura_surp_gasp_1",
      "Shocked Jaw Drop Cartoon",
      "https://media1.giphy.com/media/v1.Y2lkPWI5OGJhZDk4YnIyc2Jsc210dHdqdzFnYjFkOGJreTYxM3V6Y21pYnBhM3NqZzM5OCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/4Zo41lhzKt6iZ8xff9/200w.gif"
    ),
    createStaticIGif(
      "cura_surp_eyes_2",
      "Wide Eyed Unbelievable Reaction",
      "https://media4.giphy.com/media/v1.Y2lkPWI5OGJhZDk4a2J0bjJ5YnlndTl1cTRwNjRmY2I1ZjFjbjZ5MWxodGo5NDhqM3phcSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/31Zp9nzMFgqOHUKtiE/200w.gif"
    ),
    createStaticIGif(
      "cura_surp_pop_3",
      "Astonished Character Reaction",
      "https://media2.giphy.com/media/v1.Y2lkPWI5OGJhZDk4cnZ5dDRlcnlyNGc4eTZ4aHlxejFjcnlkNXkyNnV3MHRlNGs2Mjh2MyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Cmr1OMJ2L0QJq/200w.gif"
    ),
  ],
  agreement: [
    createStaticIGif(
      "cura_agree_nod_1",
      "Enthusiastic Nodding Yes",
      "https://media4.giphy.com/media/v1.Y2lkPWI5OGJhZDk4a2J0bjJ5YnlndTl1cTRwNjRmY2I1ZjFjbjZ5MWxodGo5NDhqM3phcSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/31Zp9nzMFgqOHUKtiE/200w.gif"
    ),
    createStaticIGif(
      "cura_agree_thumbs_2",
      "Big Thumbs Up Approval",
      "https://media1.giphy.com/media/v1.Y2lkPWI5OGJhZDk4MmhxbjZud2Y3ZzBhb3BxbG15M244cjE2Z3BhZHF2amV6bjM2aGVscCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/ASd0Ukj0y3qMM/200w.gif"
    ),
    createStaticIGif(
      "cura_agree_point_3",
      "Finger Guns Exactly Right",
      "https://media0.giphy.com/media/v1.Y2lkPWI5OGJhZDk4NWRrMXJjNGszaWpnNzdwZWV0OXF3bzRwNzhsZTFtY3Z1MXpka2Z3ciZlcD12MV9naWZzX3NlYXJjaCZjdD1n/ICOgUNjpvO0PC/200w.gif"
    ),
  ],
  disagreement: [
    createStaticIGif(
      "cura_disagree_sideeye_1",
      "Funny Skeptical Side Eye Meme",
      "https://media0.giphy.com/media/v1.Y2lkPWI5OGJhZDk4NWRrMXJjNGszaWpnNzdwZWV0OXF3bzRwNzhsZTFtY3Z1MXpka2Z3ciZlcD12MV9naWZzX3NlYXJjaCZjdD1n/ICOgUNjpvO0PC/200w.gif"
    ),
    createStaticIGif(
      "cura_disagree_doubt_2",
      "Suspicious Eyebrow Raise",
      "https://media2.giphy.com/media/v1.Y2lkPWI5OGJhZDk4cnZ5dDRlcnlyNGc4eTZ4aHlxejFjcnlkNXkyNnV3MHRlNGs2Mjh2MyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Cmr1OMJ2L0QJq/200w.gif"
    ),
    createStaticIGif(
      "cura_disagree_nope_3",
      "Gentle Head Shake Doubtful",
      "https://media3.giphy.com/media/v1.Y2lkPWI5OGJhZDk4MXptdXJmcnNidXdzMW50ZnVsc2VpcnAwa2FsdG4xZWk4eWF2Mmx1ZyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/bcKmIWkUMCjVm/200w.gif"
    ),
  ],
  motivation: [
    createStaticIGif(
      "cura_motiv_flex_1",
      "Determined Let's Go Energy",
      "https://media3.giphy.com/media/v1.Y2lkPWI5OGJhZDk4ZjRxZXlubGJ2c2c0ajNqNmlhMTlvYzJ3emV0OWcwN3Ezc3c0a3lkbiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/U25VJEFwDEoQrWfo2z/200w.gif"
    ),
    createStaticIGif(
      "cura_motiv_fistpump_2",
      "Fist Pump You Got This",
      "https://media1.giphy.com/media/v1.Y2lkPWI5OGJhZDk4Zmlnb3B5dWVwOHI1cjN1ODZrcGk1dms5ZTN0eHdxN29rZmpveGg2cCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/artj92V8o75VPL7AeQ/200w.gif"
    ),
    createStaticIGif(
      "cura_motiv_cheer_3",
      "Pumping Up Motivation",
      "https://media4.giphy.com/media/v1.Y2lkPWI5OGJhZDk4a2J0bjJ5YnlndTl1cTRwNjRmY2I1ZjFjbjZ5MWxodGo5NDhqM3phcSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/31Zp9nzMFgqOHUKtiE/200w.gif"
    ),
  ],
  sadness: [
    createStaticIGif(
      "cura_sad_hug_1",
      "Comforting Warm Hug Wholesome",
      "https://media2.giphy.com/media/v1.Y2lkPWI5OGJhZDk4a28xbWVxcmszMmZ6ZTRpMHRkMnNmdG1oamoxOXhhbmtlcmxwdnphdyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/xUA7aZhmzXeNq7gWNq/200w.gif"
    ),
    createStaticIGif(
      "cura_sad_pat_2",
      "Gentle Pat On Back Support",
      "https://media1.giphy.com/media/v1.Y2lkPWI5OGJhZDk4YnIyc2Jsc210dHdqdzFnYjFkOGJreTYxM3V6Y21pYnBhM3NqZzM5OCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/4Zo41lhzKt6iZ8xff9/200w.gif"
    ),
    createStaticIGif(
      "cura_sad_tea_3",
      "Warm Cup Of Tea Cozy Care",
      "https://media3.giphy.com/media/v1.Y2lkPWI5OGJhZDk4ZjRxZXlubGJ2c2c0ajNqNmlhMTlvYzJ3emV0OWcwN3Ezc3c0a3lkbiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/U25VJEFwDEoQrWfo2z/200w.gif"
    ),
  ],
  stress: [
    createStaticIGif(
      "cura_stress_breathe_1",
      "Calming Deep Breath Relaxation",
      "https://media3.giphy.com/media/v1.Y2lkPWI5OGJhZDk4MXptdXJmcnNidXdzMW50ZnVsc2VpcnAwa2FsdG4xZWk4eWF2Mmx1ZyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/bcKmIWkUMCjVm/200w.gif"
    ),
    createStaticIGif(
      "cura_stress_relax_2",
      "Peaceful Calming Mind Soothing",
      "https://media2.giphy.com/media/v1.Y2lkPWI5OGJhZDk4cnZ5dDRlcnlyNGc4eTZ4aHlxejFjcnlkNXkyNnV3MHRlNGs2Mjh2MyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Cmr1OMJ2L0QJq/200w.gif"
    ),
    createStaticIGif(
      "cura_stress_nature_3",
      "Gentle Calming Breeze Cartoon",
      "https://media4.giphy.com/media/v1.Y2lkPWI5OGJhZDk4a2J0bjJ5YnlndTl1cTRwNjRmY2I1ZjFjbjZ5MWxodGo5NDhqM3phcSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/31Zp9nzMFgqOHUKtiE/200w.gif"
    ),
  ],
  food: [
    createStaticIGif(
      "cura_food_chef_1",
      "Chef Kiss Delicious Yummy Food",
      "https://media4.giphy.com/media/v1.Y2lkPWI5OGJhZDk4a2J0bjJ5YnlndTl1cTRwNjRmY2I1ZjFjbjZ5MWxodGo5NDhqM3phcSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/31Zp9nzMFgqOHUKtiE/200w.gif"
    ),
    createStaticIGif(
      "cura_food_drool_2",
      "Hungry Mouth Watering Craving",
      "https://media3.giphy.com/media/v1.Y2lkPWI5OGJhZDk4ZjRxZXlubGJ2c2c0ajNqNmlhMTlvYzJ3emV0OWcwN3Ezc3c0a3lkbiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/U25VJEFwDEoQrWfo2z/200w.gif"
    ),
    createStaticIGif(
      "cura_food_eat_3",
      "Happy Eating Tasty Meal",
      "https://media0.giphy.com/media/v1.Y2lkPWI5OGJhZDk4NWRrMXJjNGszaWpnNzdwZWV0OXF3bzRwNzhsZTFtY3Z1MXpka2Z3ciZlcD12MV9naWZzX3NlYXJjaCZjdD1n/ICOgUNjpvO0PC/200w.gif"
    ),
  ],
  travel: [
    createStaticIGif(
      "cura_travel_pack_1",
      "Excited Vacation Packing Suitcase",
      "https://media1.giphy.com/media/v1.Y2lkPWI5OGJhZDk4MmhxbjZud2Y3ZzBhb3BxbG15M244cjE2Z3BhZHF2amV6bjM2aGVscCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/ASd0Ukj0y3qMM/200w.gif"
    ),
    createStaticIGif(
      "cura_travel_plane_2",
      "Airplane Window Adventure Travel",
      "https://media2.giphy.com/media/v1.Y2lkPWI5OGJhZDk4cnZ5dDRlcnlyNGc4eTZ4aHlxejFjcnlkNXkyNnV3MHRlNGs2Mjh2MyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Cmr1OMJ2L0QJq/200w.gif"
    ),
    createStaticIGif(
      "cura_travel_beach_3",
      "Sunny Holiday Beach Excitement",
      "https://media4.giphy.com/media/v1.Y2lkPWI5OGJhZDk4a2J0bjJ5YnlndTl1cTRwNjRmY2I1ZjFjbjZ5MWxodGo5NDhqM3phcSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/31Zp9nzMFgqOHUKtiE/200w.gif"
    ),
  ],
};

/**
 * Selects an eligible non-repeating GIF from a pool using conversation history.
 *
 * Algorithm:
 * 1. Deduplicates candidate pool by ID.
 * 2. Filters out all IDs in `recentGifIds`.
 * 3. If all candidates have been exhausted:
 *    Rotates history and allows reuse only after exhausting alternatives,
 *    excluding the immediately previous GIF to prevent consecutive repetition.
 * 4. Randomly selects among eligible candidates.
 */
export function selectGifFromPool(
  category: ReactionCategory,
  pool: IGif[],
  recentGifIds: string[] = [],
  lastServedId?: string
): IGif | null {
  if (!pool || pool.length === 0) {
    return null;
  }

  // Deduplicate pool by ID
  const seen = new Set<string>();
  const uniquePool: IGif[] = [];
  for (const g of pool) {
    if (!g || !g.id) continue;
    const idStr = String(g.id);
    if (!seen.has(idStr)) {
      seen.add(idStr);
      uniquePool.push(g);
    }
  }

  if (uniquePool.length === 0) {
    return null;
  }

  const explicitLastId =
    lastServedId !== undefined
      ? String(lastServedId)
      : (recentGifIds.length > 0 ? String(recentGifIds[recentGifIds.length - 1]) : "");

  const recentSet = new Set(recentGifIds.map(String));

  // Exclude all recently served IDs in this conversation
  let eligible = uniquePool.filter((g) => !recentSet.has(String(g.id)));

  // If all results have been used, rotate history and exclude strictly the immediately previous GIF
  if (eligible.length === 0) {
    eligible = uniquePool.filter((g) => String(g.id) !== explicitLastId);
    if (eligible.length === 0) {
      eligible = uniquePool;
    }
  }

  // Uniform random selection among eligible results
  const randomIndex = Math.floor(Math.random() * eligible.length);
  return eligible[randomIndex] || null;
}

