import React from 'react'

function OptionCard({ title, description, buttonText, path }) {
  const handleClick = () => {
    console.log(`Navigating to ${path}`)
    // Navigation would be implemented here when we add routing
  }

  return (
    <div className="bg-dark-card border-3 border-white rounded-none p-10 text-center flex flex-col h-full shadow-brutal-lg relative overflow-hidden transition-transform hover:translate-y-[-5px] hover:border-primary
      before:content-[''] before:absolute before:w-[100px] before:h-[100px] before:bg-primary before:top-[-50px] before:right-[-50px] before:rotate-45 before:opacity-20 before:transition-transform
      hover:before:scale-150 hover:before:opacity-10">
      <h2 className="text-4xl mb-6 text-white font-extrabold uppercase -tracking-tight relative inline-block self-center
        after:content-[''] after:absolute after:h-2 after:w-full after:bg-secondary after:bottom-0 after:left-0 after:-z-10 after:translate-y-0.5">
        {title}
      </h2>
      <p className="flex-grow mb-8 text-white/70 text-lg relative">
        {description}
      </p>
      <button 
        onClick={handleClick} 
        className="bg-white text-dark border-3 border-white px-8 py-4 text-base rounded-none font-bold uppercase shadow-brutal self-center w-auto min-w-[200px]
        hover:bg-dark hover:text-white hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[3px_3px_0_rgba(0,0,0,0.5)]">
        {buttonText}
      </button>
    </div>
  )
}

export default OptionCard
