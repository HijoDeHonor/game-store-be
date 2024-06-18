export const tryCatch = (controller) => async (req, res, next) => {
  try {
    await controller
  } catch (error) {
    next(error)
  }
}
