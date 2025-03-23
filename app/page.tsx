import MessageBoard from "@/components/message-board"
import VisitorCounter from "@/components/visitor-counter"
import Navbar from "@/components/navbar"
import Image from "next/image"
export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="p-6 md:p-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Profile Section */}
          <section className="flex flex-col md:flex-row items-center gap-8 bg-white p-8 rounded-xl shadow-sm">
            <div className="w-48 h-48 rounded-full overflow-hidden flex-shrink-0 border-4 border-primary/20">
              <Image
                    src={`/globe.svg`}
                    alt={"Profile"}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
            </div>
            <div className="space-y-4 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-800">Albert Cheng</h1>
              <div className="bg-primary/10 px-4 py-2 rounded-lg inline-block text-primary-foreground">
                <p className="text-sm font-medium">Website Template</p>
              </div>
              <p className="text-gray-600 max-w-xl">
                Hello! I am a Student
              </p>
            </div>
          </section>

          {/* Message Board */}
          <section className="bg-white p-8 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Message Board</h2>
            <MessageBoard />
          </section>

          {/* Visitor Counter */}
          <section className="bg-white p-6 rounded-xl shadow-sm text-center">
            <VisitorCounter />
          </section>
        </div>
      </main>
    </div>
  )
}

