import { driver } from "driver.js";
import "driver.js/dist/driver.css";

let driverInstance: any = null;

export const startFrogTutorial = () => {
    if (driverInstance) {
        driverInstance.destroy();
    }

    driverInstance = driver({
        showProgress: true,
        animate: true,
        popoverClass: 'mascot-speech-bubble',
        overlayColor: 'rgba(0, 0, 0, 0.75)',
        stagePadding: 8,
        stageRadius: 16,
        onDestroyed: () => {
            driverInstance = null;
        },
        onDestroyStarted: () => {
            if (driverInstance) {
                driverInstance.destroy();
                driverInstance = null;
            }
        },
        steps: [
            {
                element: '#tour-map',
                popover: {
                    title: '<img src="/bot-wave-removebg-preview.png" class="mascot-avatar" /> Quest-Bot',
                    description: "Welcome to SideQuest! I'm Quest-Bot. This is your campus map. See those pins? They are live tasks—or 'Quests'—posted by students in zones like the IT Dept, Library, or Hostels.",
                    side: "left",
                    align: 'start'
                }
            },
            {
                element: '#tour-feed',
                popover: {
                    title: '<img src="/bot-excited-removebg-preview.png" class="mascot-avatar" /> Quest-Bot',
                    description: "Want to help out and earn rewards? Browse the feed! You can filter quests by categories like 'Code/Debugging' or 'Quick Favors', and check their Urgency levels.",
                    side: "right",
                    align: 'start'
                }
            },
            {
                element: '#tour-accept-btn',
                popover: {
                    title: '<img src="/bot-point-removebg-preview.png" class="mascot-avatar" /> Quest-Bot',
                    description: "When you find a task you like, click 'Accept Quest' to lock it in! Once you finish the job, just paste a Google Drive link as proof to claim your bounty.",
                    side: "right",
                    align: 'start'
                }
            },
            {
                element: '#tour-post-btn',
                popover: {
                    title: '<img src="/bot-coin-removebg-preview.png" class="mascot-avatar" /> Quest-Bot',
                    description: "Need a hand with something yourself? Click here to post your own bounty! Set your location, time limit, and a reward—like Coins, Rupees, or even a Coffee—and let your peers come to the rescue.",
                    side: "bottom",
                    align: 'end'
                }
            },
            {
                element: '#tour-stats',
                popover: {
                    title: '<img src="/bot-stars-removebg-preview.png" class="mascot-avatar" /> Quest-Bot',
                    description: "Every completed quest earns you XP and builds your stats! Rack up XP to level up, earn custom badges, and climb the Leaderboard. Are you ready for your first SideQuest?",
                    side: "bottom",
                    align: 'end'
                }
            }
        ]
    });

    driverInstance.drive();
    return driverInstance;
};