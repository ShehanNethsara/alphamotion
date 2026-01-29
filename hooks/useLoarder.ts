import { useContext } from "react"
import { LoaderContext } from "@/context/LoaderContext" 

export const useLoader = () => {
  const context = useContext(LoaderContext)
  if (!context) {
    throw new Error("UseLoader must be used withing a LoaderProvider...!")
  }
  return context
}
