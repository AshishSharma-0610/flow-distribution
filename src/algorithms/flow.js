function distributeUsers(users, astrologers) {


    if (!Array.isArray(users) || !Array.isArray(astrologers)) {
        throw new Error('Invalid input: users and astrologers must be arrays');
    }

    if (astrologers.length === 0) {
        throw new Error('No astrologers available for distribution');
    }




    const assignments = {};
    let currentAstrologerIndex = 0;

    users.forEach(user => {
        let assigned = false;
        const initialIndex = currentAstrologerIndex;

        do {
            const astrologer = astrologers[currentAstrologerIndex];
            if (astrologer.canTakeMoreUsers()) {
                assignments[user.id] = astrologer.id;
                astrologer.addUser();
                assigned = true;
            }
            currentAstrologerIndex = (currentAstrologerIndex + 1) % astrologers.length;
        } while (!assigned && currentAstrologerIndex !== initialIndex);

        if (!assigned) {
            assignments[user.id] = null;
        }
    });

    return assignments;
}
module.exports = distributeUsers;