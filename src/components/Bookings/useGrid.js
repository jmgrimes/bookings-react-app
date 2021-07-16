import {
    useMemo
} from "react";

import {
    sessions as sessionNames
} from "../../static.json";
import {
    addDays,
    shortISO
} from "../../utils/dates";

const getGrid = (bookable, startDate) => {
    const dates = bookable.days.sort().map((day) => shortISO(addDays(startDate, day)));
    const sessions = bookable.sessions.map((session) => sessionNames[session]);
    const grid = {};
    sessions.forEach((session) => {
        grid[session] = {};
        dates.forEach((date) => {
            grid[session][date] = {
                session,
                date,
                bookableId: bookable.id,
                title: ""
            };
        });
    });
    return {
        grid,
        dates,
        sessions
    };
};

const useGrid = (bookable, startDate) => {
    return useMemo(
        () => bookable ? getGrid(bookable, startDate) : {},
        [bookable, startDate]
    );
}

export default useGrid;