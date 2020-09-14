import express from "express";
import helmet from "helmet";
import fs from "fs";
import { generate as rng } from "randomstring";
import mime from "mime-types";
import fileUpload from "express-fileupload";
try {
	fs.mkdirSync("data");
} catch (_) {}

const app = express();

const creds = (process.env.CDN_CREDS || "")
	.split("|")
	.filter(x => x.trim() !== "")
	.map(x => {
		const [folder, secret] = x.split(":");
		return { folder, secret };
	});

app.use(
	helmet({
		contentSecurityPolicy: false,
	})
);
app.use(express.static("data"));
app.use(fileUpload({ preserveExtension: true, safeFileNames: true }));

app.post("/upload/:token", (req, res) => {
	const cred: { folder: string; secret: string } | undefined = creds.filter(
		x => x.secret == req.params.token
	)[0];
	if (process.env.DEBUG == "personalcdn")
		console.log({ cred, creds, params: req.params });
	if (!cred) return res.status(403).json({ error: "forbidden" });

	let file = req.files?.file;
	if (Array.isArray(file)) file = file[0];
	if (!file) return res.status(400).json({ error: "no file attached" });

	const ext = mime.extension(file.mimetype);
	if (!ext) return res.json({ error: "invalid mimetype" });

	const path = `${rng(7)}.${ext}`;
	const fullPath = (cred.folder ? cred.folder + "/" : "") + path;

	file.mv("data/" + fullPath);

	res.json({ message: "uploaded", file: path, fullPath });
});

app.listen(process.env.PORT || 8080);
