import { motion } from 'framer-motion'
import React from 'react'

import { pageVariants } from '../../motions/page'

const Page: React.FC = ({ children }) => (
  <motion.div className="page" initial="initial" animate="in" exit="out" variants={pageVariants}>
    {children}
  </motion.div>
)

export default Page
