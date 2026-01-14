const prisma = require("../prisma/client");

//all users get methods
exports.getAllUsersWithPersonalDetails = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        userPersonalDetails: true,
      },
    });

    res.status(200).json({
      message: "Users fetched successfully",
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createPersonalDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const data = req.body;

    // Explicitly extract fields and convert types where necessary
    const {
      firstName,
      lastName,
      gender,
      dateOfBirth,
      personalEmail,
      phoneNumber,
      alternatePhone,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      maritalStatus,
      bloodGroup,
      nationality,
    } = data;

    const details = await prisma.userPersonalDetails.create({
      data: {
        userId: String(userId),
        firstName: String(firstName),
        lastName: String(lastName),
        gender: String(gender),
        dateOfBirth: new Date(dateOfBirth),
        personalEmail: String(personalEmail),
        phoneNumber: String(phoneNumber),
        alternatePhone: alternatePhone ? String(alternatePhone) : null,
        addressLine1: String(addressLine1),
        addressLine2: addressLine2 ? String(addressLine2) : null,
        city: String(city),
        state: String(state),
        pincode: Number(pincode),
        maritalStatus: String(maritalStatus),
        bloodGroup: bloodGroup ? String(bloodGroup) : null,
        nationality: String(nationality),
      },
    });

    res.status(201).json({
      message: "Personal details created",
      data: details,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET USER PROFILE ================= */
exports.getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { userId: String(userId) },
      include: {
        userPersonalDetails: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= UPDATE PERSONAL DETAILS ================= */
exports.updatePersonalDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const data = req.body; 
    const updated = await prisma.userPersonalDetails.update({
      where: { userId: String(userId) },
      data: {
        firstName: data.firstName ? String(data.firstName) : undefined,
        lastName: data.lastName ? String(data.lastName) : undefined,
        gender: data.gender ? String(data.gender) : undefined,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
        personalEmail: data.personalEmail ? String(data.personalEmail) : undefined,
        phoneNumber: data.phoneNumber ? String(data.phoneNumber) : undefined,
        alternatePhone: data.alternatePhone ? String(data.alternatePhone) : undefined,
        addressLine1: data.addressLine1 ? String(data.addressLine1) : undefined,
        addressLine2: data.addressLine2 ? String(data.addressLine2) : undefined,
        city: data.city ? String(data.city) : undefined,
        state: data.state ? String(data.state) : undefined,
        pincode: data.pincode ? Number(data.pincode) : undefined,
        maritalStatus: data.maritalStatus ? String(data.maritalStatus) : undefined,
        bloodGroup: data.bloodGroup ? String(data.bloodGroup) : undefined,
        nationality: data.nationality ? String(data.nationality) : undefined,
      },
    });

    res.json({
      message: "Personal details updated",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= DELETE PERSONAL DETAILS ================= */
exports.deletePersonalDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    await prisma.userPersonalDetails.delete({
      where: { userId: String(userId) },
    });

    res.json({ message: "Personal details deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
