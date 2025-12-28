"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useUser } from "@clerk/nextjs";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import DatePicker from "react-datepicker";
import { toast } from "sonner";

import MenuItemCard from "./MenuItemCard";
import Loading from "./Loading";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";

interface FormValues {
  dateTime: Date | null;
  description: string;
  link: string;
}

const initialValues: FormValues = {
  dateTime: new Date(),
  description: "",
  link: "",
};

const MainMenu = () => {
  const router = useRouter();
  const { user } = useUser();
  const client = useStreamVideoClient();

  const [values, setValues] = useState<FormValues>(initialValues);

  if (!client || !user) return <Loading />;

  const createMeeting = async (type: "Instant" | "Schedule") => {
    try {
      if (type === "Schedule" && !values.dateTime) {
        toast("Please select a date and time", { duration: 3000 });
        return;
      }

      const id = crypto.randomUUID();
      const call = client.call("default", id);
      if (!call) throw new Error("Failed to create meeting");

      const startsAt = values.dateTime?.toISOString() || new Date().toISOString();
      const description = values.description || "No Description";

      await call.getOrCreate({
        data: { starts_at: startsAt, custom: { description } },
      });

      await call.updateCallMembers({ update_members: [{ user_id: user.id }] });

      if (type === "Instant") {
        router.push(`/meeting/${call.id}`);
        toast("Setting up your meeting", { duration: 3000 });
      }

      if (type === "Schedule") {
        router.push("/upcoming");
        toast(`Your meeting is scheduled at ${values.dateTime}`, { duration: 5000 });
      }
    } catch (err: any) {
      toast(`Failed to create Meeting: ${err.message}`, { duration: 3000 });
    }
  };

  const joinMeeting = () => {
    if (!values.link) {
      toast("Please enter a meeting link", { duration: 3000 });
      return;
    }
    router.push(values.link);
  };

  return (
    <section className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
      {/* New Meeting */}
      <Dialog>
        <DialogTrigger>
          <MenuItemCard
            img="/assets/new-meeting.svg"
            title="New Meeting"
            bgColor="bg-orange-500"
            hoverColor="hover:bg-orange-800"
          />
        </DialogTrigger>
        <DialogContent className="bg-gray-200 px-16 py-10 text-gray-900 rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black leading-relaxed text-center">
              Start an Instant Meeting 🤝
            </DialogTitle>
            <DialogDescription className="flex flex-col items-center gap-3">
              Add a meeting description
              <Textarea
                className="inputs p-5"
                rows={4}
                onChange={(e) =>
                  setValues({ ...values, description: e.target.value })
                }
              />
              <Button
                className="mt-5 font-extrabold text-lg text-white rounded-xl bg-blue-700 py-5 px-10 hover:bg-blue-900 hover:scale-105 transition-transform duration-300"
                onClick={() => createMeeting("Instant")}
              >
                Create Meeting
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Join Meeting */}
      <Dialog>
        <DialogTrigger>
          <MenuItemCard
            img="/assets/join-meeting.svg"
            title="Join Meeting"
            bgColor="bg-blue-600"
            hoverColor="hover:bg-blue-800"
          />
        </DialogTrigger>
        <DialogContent className="bg-gray-200 px-16 py-10 text-gray-900 rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black leading-relaxed text-center mb-5">
              Type the Meeting link here
            </DialogTitle>
            <DialogDescription className="flex flex-col gap-3 items-center">
              <Input
                type="text"
                placeholder="Meeting Link"
                value={values.link}
                onChange={(e) =>
                  setValues({ ...values, link: e.target.value })
                }
                className="inputs"
              />
              <Button
                className="mt-5 font-extrabold text-lg text-white rounded-xl bg-blue-700 py-5 px-10 hover:bg-blue-900 hover:scale-105 transition-transform duration-300"
                onClick={joinMeeting}
              >
                Join Meeting
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Schedule Meeting */}
      <Dialog>
        <DialogTrigger>
          <MenuItemCard
            img="/assets/calendar.svg"
            title="Schedule"
            bgColor="bg-blue-600"
            hoverColor="hover:bg-blue-800"
          />
        </DialogTrigger>
        <DialogContent className="bg-gray-200 px-16 py-10 text-gray-900 rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black leading-relaxed text-center mb-5">
              Schedule Meeting
            </DialogTitle>
            <DialogDescription className="flex flex-col gap-3">
              Add a meeting description
              <Textarea
                className="inputs p-5"
                rows={4}
                onChange={(e) =>
                  setValues({ ...values, description: e.target.value })
                }
              />
            </DialogDescription>
            <div className="flex w-full flex-col gap-2.5">
              <label className="text-base font-normal leading-[22.4px] text-sky-2">
                Select Date and Time
              </label>
              <DatePicker
                selected={values.dateTime}
                onChange={(date: Date | null) =>
                  setValues({ ...values, dateTime: date })
                }
                showTimeSelect
                timeIntervals={15}
                timeCaption="time"
                dateFormat="MMMM d, yyyy h:mm aa"
                className="inputs w-full rounded p-2 focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-200"
              />
            </div>
            <Button
              className="mt-5 font-extrabold text-lg text-white rounded-xl bg-blue-700 py-5 px-10 hover:bg-blue-900 hover:scale-105 transition-transform duration-300"
              onClick={() => createMeeting("Schedule")}
            >
              Submit
            </Button>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Recordings */}
      <MenuItemCard
        img="/assets/recordings2.svg"
        title="Recordings"
        bgColor="bg-blue-600"
        hoverColor="hover:bg-blue-800"
        handleClick={() => router.push("/recordings")}
      />
    </section>
  );
};

export default MainMenu;
