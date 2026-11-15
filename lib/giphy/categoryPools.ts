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
  | "fitness";

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
  recentGifIds: string[] = []
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

  const recentSet = new Set(recentGifIds.map(String));

  // Exclude all recently served IDs in this conversation
  let eligible = uniquePool.filter((g) => !recentSet.has(String(g.id)));

  // If all results have been used, rotate history and exclude only the most recent GIF
  if (eligible.length === 0) {
    const lastServedId = recentGifIds.length > 0 ? String(recentGifIds[recentGifIds.length - 1]) : "";
    eligible = uniquePool.filter((g) => String(g.id) !== lastServedId);
    if (eligible.length === 0) {
      eligible = uniquePool;
    }
  }

  // Uniform random selection among eligible results
  const randomIndex = Math.floor(Math.random() * eligible.length);
  return eligible[randomIndex] || null;
}

